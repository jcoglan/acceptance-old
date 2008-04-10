var Acceptance = (function() {
    
    //================================================================
    // DSL function and public methods
    //================================================================
    
    var environment = function(rules) {
        rules.apply(Root);
    };
    
    var forms = {};
    var getForm = function(id) {
        return forms[id] || (forms[id] = new FormDescription(id));
    };
    
    Object.extend(environment, {
        reattach: function() {
            var n = 0;
            for (var key in forms) {
                if (forms[key]._attach()) ++n;
            }
            return n;
        }
    });
    
    //================================================================
    // Constants
    //================================================================
    
    var NUMBER_FORMAT = /^\-?(0|[1-9]\d*)(\.\d+)?(e[\+\-]?\d+)?$/i;
    var EMAIL_FORMAT = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/i;
    
    //================================================================
    // Private utility methods
    //================================================================
    
    var isBlank = function(value) {
        return value ? false : (String(value).strip() == '');
    };
    
    var isNumeric = function(value) {
        return NUMBER_FORMAT.test(String(value));
    };
    
    var isPresent = function(value) {
        return !isBlank(value) || ['is required'];
    };
    
    var getLabel = function(input) {
        input = $(input);
        if (!input) return null;
        var label = input.ancestors().find(function(tag) { return tag.match('label') });
        if (label) return label;
        var id = input.id;
        if (!id) return null;
        return $$('label[for=' + id + ']')[0] || null;
    };
    
    var getData = function(form) {
        return $(form).serialize(true);
    };
    
    var setValue = function(elements, value) {
        var selected, options, element = elements[0];
        switch (true) {
            
            case elements.all(function(e) { return e.match('[type=radio]') }) :
                selected = elements.find(function(e) { return e.value == value });
                if (!selected) return;
                elements.each(function(e) { e.checked = false });
                selected.checked = true;
                break;
            
            case element.match('[type=checkbox]') :
                element.checked = !!value;
                break;
            
            case element.match('select') :
                options = $A(element.options);
                selected = options.find(function(o) { return o.value == value });
                if (!selected) return;
                options.each(function(o) { o.selected = false });
                selected.selected = true;
                break;
            
            case element.match('input') :
            case element.match('[type=hidden]') :
            case element.match('textarea') :
                element.value = String(value);
                break;
        }
    };
    
    //================================================================
    // DSL root object with top-level functions
    //================================================================
    
    var Root = {
        form: function(id) {
            return getForm(id)._dsl || null;
        },
        when: function(id) {
            return getForm(id)._when || null;
        },
        before: function(id) {
            return getForm(id)._before || null;
        },
        displayErrorsIn: function() {
            // TODO
        },
        displayResponseIn: function() {
            // TODO
        },
        EMAIL_FORMAT: EMAIL_FORMAT
    };
    
    //================================================================
    // Class: FormDSL
    //================================================================
    
    var FormDSL = Class.create({
        initialize: function(form) {
            this._form = form;
        },
        requires: function(name, displayed) {
            var requirement = this._form._getRequirement(name);
            if (displayed) this._form._names[name] = displayed;
            return requirement._dsl;
        },
        validates: function(block) {
            this._form._validators.push(block);
            return this;
        },
        submitsUsingAjax: function() {
            this._form._ajax = true;
            return this;
        }
    });
    FormDSL.prototype.expects = FormDSL.prototype.requires;
    FormDSLMethods = ['requires', 'expects', 'validates', 'submitsUsingAjax'];
    
    //================================================================
    // Class: RequirementDSL
    //================================================================
    
    var RequirementDSL = Class.create({
        initialize: function(requirement) {
            this._requirement = requirement;
        },
        toBeChecked: function(message) {
            var requirement = this._requirement;
            this._requirement._add(function(value) {
                var element = requirement._elements[0];
                return (value == element.value && element.checked) || [message || 'must be checked'];
            });
            return this;
        },
        toBeNumeric: function(message) {
            this._requirement._add(function(value) {
                return isNumeric(value) || [message || 'must be a number'];
            });
            return this;
        },
        toBeOneOf: function(list, message) {
            this._requirement._add(function(value) {
                return list.include(value) || [message || 'is not valid'];
            });
            return this;
        },
        toConfirm: function(field, message) {
            this._requirement._add(function(value, data) {
                return value == data.get(field) || [message || 'must be confirmed', field];
            });
            return this;
        },
        toHaveLength: function(options, message) {
            var min = options.minimum, max = options.maximum;
            this._requirement._add(function(value) {
                return  (typeof options == 'number' && value.length != options &&
                            [message || 'must contain exactly ' + options + ' characters']) ||
                        (min !== undefined && value.length < min &&
                            [message || 'must contain at least ' + min + ' characters']) ||
                        (max !== undefined && value.length > max &&
                            [message || 'must contain no more than ' + max + ' characters']) ||
                        true;
            });
            return this;
        },
        toHaveValue: function(options, message) {
            var min = options.minimum, max = options.maximum;
            this._requirement._add(function(value) {
                if (!isNumeric(value)) return [message || 'must be a number'];
                value = Number(value);
                return  (min !== undefined && value < min &&
                            [message || 'must be at least ' + min]) ||
                        (max !== undefined && value > max &&
                            [message || 'must not be greater than ' + max]) ||
                        true;
            });
            return this;
        },
        toMatch: function(format, message) {
            this._requirement._add(function(value) {
                return format.test(value) || [message || 'is not valid'];
            });
            return this;
        }
    });
    
    FormDSLMethods.each(function(method) {
        RequirementDSL.prototype[method] = function() {
            var base = this._requirement._form._dsl;
            return base[method].apply(base, arguments);
        };
    });
    
    //================================================================
    // Class: WhenDSL
    //================================================================
    
    var WhenDSL = Class.create({
        initialize: function(form) {
            this._form = form;
        },
        isValidated: function(block, context) {
            this._form.subscribe(function(form) {
                block.call(context || null, form._errors._messages());
            });
        },
        responseArrives: function(block, context) {
            if (!this._form._ajax) return;
            if (context) block = block.bind(context);
            this._form._handleAjaxResponse = block;
        }
    });
    
    //================================================================
    // Class: BeforeDSL
    //================================================================
    
    var BeforeDSL = Class.create({
        initialize: function(form) {
            this._form = form;
        },
        isValidated: function(block) {
            this._form._dataFilters.push(block);
        }
    });
    
    //================================================================
    // Class: FormDescription
    //================================================================
    
    var FormDescription = Class.create({
        initialize: function(id) {
            this._observers = [];
            this._handleSubmission = this._handleSubmission.bindAsEventListener(this);
            this._formID = id;
            this._attach();
            
            this._requirements = {};
            this._validators   = [];
            this._dataFilters  = [];
            this._dsl    = new FormDSL(this);
            this._when   = new WhenDSL(this);
            this._before = new BeforeDSL(this);
        },
        subscribe: function(block, context) {
            this._observers.push({_blk: block, _ctx: context || null});
        },
        notifyObservers: function() {
            var args = $A(arguments);
            this._observers.each(function(observer) {
                observer._blk.apply(observer._ctx, args);
            });
        },
        _attach: function() {
            if (this._hasForm()) return false;
            this._inputs = {};
            this._labels = {};
            this._names = {};
            this._form = $(this._formID);
            if (!this._hasForm()) return false;
            this._form.observe('submit', this._handleSubmission);
            for (var field in this._requirements) this._requirements[field]._attach();
            return true;
        },
        _hasForm: function() {
            return this._form && this._form.match('body form');
        },
        _getRequirement: function(name) {
            return this._requirements[name] || (this._requirements[name] = new FormRequirement(this, name));
        },
        _handleSubmission: function(evnt) {
            var valid = this._isValid();
            if (this._ajax || !valid) Event.stop(evnt);
            if (!this._ajax || !valid) return;
            var form = this._form;
            new Ajax.Request(form.action, {
                method: form.method || 'post',
                parameters: this._data,
                onSuccess: this._handleAjaxResponse
            });
        },
        _handleAjaxResponse: function(response) {},
        
        _getInputs: function(name) {
            if (this._inputs[name]) return this._inputs[name];
            if (!this._form) return [];
            return this._inputs[name] = this._form.descendants().findAll(function(tag) {
                var isInput = tag.match('input, textarea, select');
                return isInput && (name ? (tag.name == name) : true);
            });
        },
        _getLabel: function(name) {
            if (name.name) name = name.name;
            return this._labels[name] || ( this._labels[name] = getLabel(this._getInputs(name)[0]) );
        },
        _getName: function(field) {
            if (this._names[field]) return this._names[field];
            var label = this._getLabel(field);
            var name = ((label||{}).innerHTML || field).stripTags().strip();
            
            name = name.replace(/(\w)[_-](\w)/g, '$1 $2')
                    .replace(/([a-z])([A-Z])/g, function(match, a, b) {
                        return a + ' ' + b.toLowerCase();
                    });
            
            return this._names[field] = name.charAt(0).toUpperCase() + name.substring(1);
        },
        _getData: function() {
            return this._data = getData(this._form);
        },
        _validate: function() {
            this._errors = new FormErrors(this);
            var data = this._getData(), key, input;
            this._dataFilters.each(function(filter) { filter(data); });
            for (key in data) setValue(this._getInputs(key), data[key]);
            
            data = new FormData(data);
            for (key in this._requirements)
                this._requirements[key]._test(data.get(key), data);
            
            this._validators.each(function(validate) { validate(data, this._errors); }, this);
            
            var fields = this._errors._fields();
            for (key in this._inputs)
                [this._getInputs(key), [this._getLabel(key)]].invoke('each', function(element) {
                    if (!element) return;
                    element[fields.include(key) ? 'addClassName' : 'removeClassName']('invalid');
                });
            
            this.notifyObservers(this);
        },
        _isValid: function() {
            this._validate();
            return this._errors._count() == 0;
        }
    });
    
    //================================================================
    // Class: FormRequirement
    //================================================================
    
    var FormRequirement = Class.create({
        initialize: function(form, field) {
            this._form = form;
            this._field = field;
            this._tests = [];
            this._dsl = new RequirementDSL(this);
            this._attach();
        },
        _attach: function() {
            this._elements = this._form._getInputs(this._field);
        },
        _add: function(block) {
            this._tests.push(block);
        },
        _test: function(value, data) {
            var errors = [], tests = this._tests.length ? this._tests : [isPresent], value = value || '';
            tests.each(function(block) {
                var result = block(value, data), message, field;
                if (result !== true) {
                    message = result[0]; field = result[1] || this._field;
                    this._form._errors.register(this._field);
                    this._form._errors.add(field, message);
                }
            }, this);
            return errors.length ? errors : true;
        }
    });
    
    //================================================================
    // Class: FormData
    //================================================================
    
    var FormData = Class.create({
        initialize: function(data) {
            this.get = function(field) {
                return data[field] === undefined ? null : data[field];
            };
        }
    });
    
    //================================================================
    // Class: FormErrors
    //================================================================
    
    var FormErrors = Class.create({
        initialize: function(form) {
            var errors = {}, base = [];
            Object.extend(this, {
                register: function(field) {
                    errors[field] = errors[field] || [];
                },
                add: function(field, message) {
                    this.register(field);
                    errors[field].push(message);
                },
                addToBase: function(message) {
                    base.push(message);
                },
                _count: function() {
                    var n = base.length;
                    for (var field in errors) n += errors[field].length;
                    return n;
                },
                _messages: function() {
                    var name, messages = base.map(function(message) {
                        return {field: null, message: message};
                    });
                    for (var field in errors) {
                        name = form._getName(field);
                        errors[field].each(function(message) {
                            messages.push({field: field, message: name + ' ' + message});
                        });
                    }
                    return messages;
                },
                _fields: function() {
                    var fields = [];
                    for (var field in errors) fields.push(field);
                    return fields;
                }
            });
        }
    });
    
    return environment;
})();
