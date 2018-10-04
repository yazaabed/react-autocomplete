import React from 'react';

export default class Autocomplete extends React.Component {
  static defaultProps = {
    onChange: selection => selection,
    onOutsideClicked: () => {}
  };

  items = [];

  state = {
    selectedItem: null,
    inputValue: '',
    isOpen: this.props.isOpen || false,
    highlightedIndex: null
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleBodyClicked);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleBodyClicked);
  }

  isControlledProps = prop => {
    return typeof this.props[prop] !== 'undefined';
  };

  handleCloseDropdown = () => {
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
    }
  };

  handleClickOutside = () => {
    this.handleCloseDropdown();
    this.props.onOutsideClicked();
  };

  handleBodyClicked = event => {
    if (this.parentNode) {
      if (this.parentNode.contains(event.target)) {
        return event;
      }

      this.handleClickOutside();
    }
  };

  changeState = (newState, stateChanged) => {
    let prevState;

    this.setState(
      state => {
        prevState = state;

        return Object.assign({}, state, newState);
      },
      () => {
        stateChanged && stateChanged(prevState, this.state);
      }
    );
  };

  onItemSelected = item => {
    this.changeState(
      {
        selectedItem: item
      },
      (prevState, state) => {
        this.props.onChange(item);
        this.handleCloseDropdown();
      }
    );
  };

  getItemProps = (options = {}) => {
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

    return {
      onClick: event => {
        this.onItemSelected(options.item);
      },
      key: options.key || options.index,
      className: [
        options.className,
        options.index === this.state.highlightedIndex
          ? 'drop-down-active-li'
          : null
      ].join(' '),
      ...newOptions
    };
  };

  handleInputKeyUp = event => {
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

        this.changeState(
          {
            highlightedIndex: index
          },
          () => {
            let activeElement = this.listElement.querySelector(
              '.drop-down-active-li'
            );
            let listElement = this.listElement;

            if (activeElement) {
              let activeElementItemTop =
                activeElement.offsetTop + activeElement.offsetHeight;

              if (activeElementItemTop >= listElement.offsetHeight) {
                this.listElement.scrollTop += activeElement.offsetHeight;
              } else {
                this.listElement.scrollTop -= activeElement.offsetHeight;
              }
            }
          }
        );
      }
    }
  };

  getInputProps = (options = {}) => {
    return {
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
      autoComplete: 'off',
      ...options
    };
  };

  getMenuProps = (options = {}) => {
    return {
      ref: node => (this.listElement = node),
      ...options
    };
  };

  getContainerProps = (options = {}) => {
    return {
      ref: node => {
        if (node) {
          this.parentNode = node;
          this.parentNode.querySelector('input').focus();
        } else {
          delete this.parentNode;
        }
      },
      ...options
    };
  };

  render() {
    this.items = [];

    return this.props.children({
      getContainerProps: this.getContainerProps,
      getItemProps: this.getItemProps,
      selectedItem: this.state.selectedItem,
      getInputProps: this.getInputProps,
      getMenuProps: this.getMenuProps,
      inputValue: this.state.inputValue,
      isOpen: this.isControlledProps('isOpen')
        ? this.props.isOpen
        : this.state.isOpen,
      highlightedIndex: this.state.highlightedIndex
    });
  }
}
