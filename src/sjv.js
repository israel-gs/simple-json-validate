/*!
 * sjv.js
 * (c) 2018- Israel Gutierrez (israel-gs)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.Sjv = factory());
})(this, function () {
  'use strict';
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasAttribute(json_object, key) {
    return hasOwnProperty.call(json_object, key);
  }

  function isJsonObject(json_object) {
    return (json_object && typeof json_object === 'object' && !Array.isArray(json_object));
  }

  function isJsonArray(json_object) {
    return (json_object && typeof json_object === 'object' && Array.isArray(json_object));
  }

  function haveAllRuleAttibutes(rule_object) {
    return (hasAttribute(rule_object, 'name') && hasAttribute(rule_object, 'required') ? true : false);
  }

  function existErrorMessage(Sjv, type) {
    return (Sjv.custom_error_messages ? Sjv.custom_error_messages[type] : false);
  }

  function createErrorMessage(Sjv, type, key_name) {
    var message = '';
    switch (type) {
      case 'required':
        message = (existErrorMessage(Sjv, 'required_message') ? Sjv.custom_error_messages.required_message : Sjv.error_messages.required_message).replace('_KEY_', key_name);
        break;
      case 'max_length':
        message = (existErrorMessage(Sjv, 'max_length_message') ? Sjv.custom_error_messages.max_length_message : Sjv.error_messages.max_length_message).replace('_KEY_', key_name);
        break;
      case 'format':
        message = (existErrorMessage(Sjv, 'format_message') ? Sjv.custom_error_messages.format_message : Sjv.error_messages.format_message).replace('_KEY_', key_name);
        break;
    }
    return message;
  }

  function Sjv(configuration) {
    if (configuration) {
      this.rules = configuration.rules;
      this.custom_error_messages = configuration.custom_error_messages ? configuration.custom_error_messages : '';

      this.error_messages = {
        required_message: '_KEY_ is required but not found in object.',
        max_length_message: 'The value of _KEY_ exceeds the set length in rule.',
        format_message: 'The value of _KEY_ does not match with the format set.'
      };
    }
  }

  Sjv.prototype.validate = function (obj) {
    var self = this;
    var errors = [];
    if (isJsonObject(obj)) {
      try {
        this.rules.forEach((rule, index) => {
          if (haveAllRuleAttibutes(rule)) {
            var key_name = rule.name;
            var format = rule.format ? rule.format : /.*/;
            var is_required = rule.required;
            var max_length = rule.max_length;

            if (is_required && !obj[key_name]) {
              errors.push(createErrorMessage(self, 'required', key_name));
            } else if (obj[key_name]) {
              if (!format.test(obj[key_name])) {
                errors.push(createErrorMessage(self, 'format', key_name));
              }
              if (max_length) {
                if (obj[key_name].length > max_length) {
                  errors.push(createErrorMessage(self, 'max_length', key_name));
                }
              }
            }
          } else {
            console.error('All objects in the rule must have the attributes name and required.');
          }
        })

      } catch (error) {
        console.error(error.message);
      }
    }
    return errors;
  }

  return Sjv;
})