function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
export default class Autocomplete extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "items", []);

    _defineProperty(this, "state", {
      selectedItem: null,
      inputValue: '',
      isOpen: this.props.isOpen || false,
      highlightedIndex: null
    });

    _defineProperty(this, "isControlledProps", prop => {
      return typeof this.props[prop] !== 'undefined';
    });

    _defineProperty(this, "handleCloseDropdown", () => {
      if (!this.isControlledProps('isOpen')) {
        this.changeState({
          isOpen: false,
          inputValue: '',
          highlightedIndex: null
        });
      } else {
        this.changeState({
          inputValue: ''
        });
        this.props.onOutsideClicked();
      }
    });

    _defineProperty(this, "handleClickOutside", () => {
      this.handleCloseDropdown();
    });

    _defineProperty(this, "handleBodyClicked", event => {
      if (this.parentNode) {
        if (this.parentNode.contains(event.target)) {
          return event;
        }

        this.handleClickOutside();
      }
    });

    _defineProperty(this, "changeState", (newState, stateChanged) => {
      let prevState;
      this.setState(state => {
        prevState = state;
        return Object.assign({}, state, newState);
      }, () => {
        stateChanged && stateChanged(prevState, this.state);
      });
    });

    _defineProperty(this, "onItemSelected", item => {
      this.changeState({
        selectedItem: item
      }, (prevState, state) => {
        this.props.onChange(item);
        this.handleCloseDropdown();
      });
    });

    _defineProperty(this, "getItemProps", (options = {}) => {
      if (!options.item) {
        throw new Error('item attribute is required for getItemProps');
      }

      if (typeof options.index === 'undefined') {
        throw new Error('index attribute is required for getItemProps');
      }

      if (options.index === undefined) {
        this.items.push(options.item);
        options.index = this.items.indexOf(options.item);
      } else {
        this.items[options.index] = options.item;
      }

      const newOptions = Object.assign({}, options);
      delete newOptions.item;
      delete newOptions.className;
      return _objectSpread({
        onClick: event => {
          this.onItemSelected(options.item);
        },
        key: options.key || options.index,
        className: [options.className, options.index === this.state.highlightedIndex ? 'drop-down-active-li' : null].join(' ')
      }, newOptions);
    });

    _defineProperty(this, "handleInputKeyUp", event => {
      let index;

      if (this.state.highlightedIndex === null) {
        index = -1;
      } else {
        index = this.state.highlightedIndex;
      }

      let isNotValidKey = false;
      let enterClicked = false;
      let isNotCloseClicked = true;

      switch (event.keyCode) {
        case 40:
          index += 1;
          break;

        case 38:
          index -= 1;
          break;

        case 13:
          enterClicked = true;
          break;

        case 27:
          this.handleCloseDropdown();
          isNotCloseClicked = false;
          break;

        default:
          isNotValidKey = true;
          break;
      }

      if (!isNotValidKey && isNotCloseClicked) {
        index = index >= 0 ? index : 0;
        const item = Object.assign({}, this.items[index]);

        if (Object.keys(item).length) {
          if (enterClicked) {
            this.onItemSelected(item);
          }

          this.changeState({
            highlightedIndex: index
          }, () => {
            let activeElement = this.listElement.querySelector('.drop-down-active-li');
            let listElement = this.listElement;

            if (activeElement) {
              let activeElementItemTop = activeElement.offsetTop + activeElement.offsetHeight;

              if (activeElementItemTop >= listElement.offsetHeight) {
                this.listElement.scrollTop += activeElement.offsetHeight;
              } else {
                this.listElement.scrollTop -= activeElement.offsetHeight;
              }
            }
          });
        }
      }
    });

    _defineProperty(this, "getInputProps", (options = {}) => {
      return _objectSpread({
        onChange: event => {
          let newState = {
            inputValue: event.target.value
          };

          if (!this.state.isOpen && !this.isControlledProps('isOpen')) {
            newState['isOpen'] = true;
          }

          this.changeState(newState);
        },
        onKeyDown: event => {
          this.handleInputKeyUp(event);
        },
        value: this.state.inputValue,
        autoComplete: 'off'
      }, options);
    });

    _defineProperty(this, "getMenuProps", (options = {}) => {
      return _objectSpread({
        ref: node => this.listElement = node
      }, options);
    });

    _defineProperty(this, "getContainerProps", (options = {}) => {
      return _objectSpread({
        ref: node => {
          if (node) {
            this.parentNode = node;
            this.parentNode.querySelector('input').focus();
          } else {
            delete this.parentNode;
          }
        }
      }, options);
    });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleBodyClicked);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleBodyClicked);
  }

  render() {
    this.items = [];
    return this.props.children({
      getContainerProps: this.getContainerProps,
      getItemProps: this.getItemProps,
      selectedItem: this.state.selectedItem,
      getInputProps: this.getInputProps,
      getMenuProps: this.getMenuProps,
      inputValue: this.state.inputValue,
      isOpen: this.isControlledProps('isOpen') ? this.props.isOpen : this.state.isOpen,
      highlightedIndex: this.state.highlightedIndex
    });
  }

}

_defineProperty(Autocomplete, "defaultProps", {
  onChange: selection => selection,
  onOutsideClicked: () => {}
});