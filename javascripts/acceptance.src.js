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
        return value ? false : (String(value).trim() == '');
    };
    
    var isNumeric = function(value) {
        return NUMBER_FORMAT.test(String(value));
    };
    
    var isEmailAddress = function(value) {
        return this.EMAIL_FORMAT.test(String(value));
    };
    
    var getLabel = function(input) {
        var label = $(input).ancestors().find(function(tag) { return tag.match('label') });
        if (label) return label;
        var id = input.id;
        if (!id) return null;
        return $$('label[for=' + id + ']')[0] || null;
    };
    
    var getQueryString = function(form) {
        return $(form).serialize();
    };
    
    var getData = function(form) {
        return $(form).serialize(true);
    };
    
    //================================================================
    // DSL root objects with top-level functions
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
    
    return environment;
})();
