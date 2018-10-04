# React Autocomplete
This autocomplete component built to show what render props pattern can do with react and how much it flexible.

## Introduction
- An autocomplete react component to allow user to build dynamic dropdown or searchable items.
- This component is for learning how render-props pattern word in react-js.
- For production matter you can use ["Downshift" component from paypal](https://github.com/paypal/downshift).

### Examples
```javascript
<Autocomplete
  isOpen={this.state.showDropdown}
  onOutsideClicked={() => this.hideDropdown()}
  onChange={(selection) => this.props.onSelectedItemChanged(selection)}>
  {
    ({
       getContainerProps,
       getItemProps,
       getInputProps,
       getMenuProps,
       inputValue,
       isOpen,
       highlightedIndex
     }) => {
      let itemsFiltered = this.filterItemsBySearchInput(inputValue);

      return (
        isOpen? (
          <div {...getContainerProps({ className: styles.dropdownContainer })}>

            <input type="text"
                   {...getInputProps({
                     className: styles.dropdownInput
                   })} />

            <span className={styles.hideIcon} onClick={() => this.hideDropdown()}>x</span>

            <ul {...getMenuProps({ className: styles.menuDropdown })}>
              {
                itemsFiltered
                  .map((item, index) =>
                    <li {...getItemProps({ item, index })}>
                      <ComponentExample
                             active={index === highlightedIndex}
                             className={styles.dropdownItem} />
                    </li>
                  )
              }

              {
                !itemsFiltered.length?
                  <li className={styles.noItemsFound}>
                    <h1 className={styles.notFoundTitle}>Not found.</h1>
                  </li> : null
              }
            </ul>
          </div>
        ): null
      )
    }
  }
</Autocomplete>
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Yazan Aabed**
* See also the list of [contributors](https://github.com/YazanAabeed/react-autocomplete/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* This component to learn more about react-js
