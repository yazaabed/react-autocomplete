# React Autocomplete
This autocomplete component built to show what render props pattern can do with react and how much it flexible.

## Introduction
- An autocomplete react component to allow user to build dynamic dropdown or searchable items.
- This component is for learning how render-props pattern word in react-js.
- For production matter you can use ["Downshift" component from paypal](https://github.com/paypal/downshift).

### Examples
```javascript
import React from "react";
import ReactDOM from "react-dom";
import { Autocomplete } from "@yazanaabed/react-autocomplete";
import styles from "./styles";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: true,
      items: [
        {
          username: "User1",
          id: 1
        },
        {
          username: "User2",
          id: 2
        }
      ],
      selectedItem: []
    };
  }

  filterItemsBySearchInput = inputValue => {
    return this.state.items.filter(
      item =>
        !inputValue ||
        item.username.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  onSelectedItemChanged = selection => {
    this.setState(prevState => {
      console.log(prevState, selection);

      let selectedItem = [...prevState.selectedItem];
      let isItemFound = selectedItem.find(item => item.id === selection.id);

      if (!isItemFound) {
        selectedItem.push(selection);
      }

      return {
        selectedItem
      };
    });
  };

  render() {
    return (
      <div className="App">
        <Autocomplete
          onChange={selection => this.onSelectedItemChanged(selection)}
        >
          {({
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
              <div
                {...getContainerProps({ className: styles.dropdownContainer })}
              >
                <input
                  type="text"
                  {...getInputProps({
                    className: styles.dropdownInput
                  })}
                />

                {isOpen ? (
                  <ul {...getMenuProps({ className: styles.menuDropdown })}>
                    {itemsFiltered.map((item, index) => (
                      <li {...getItemProps({ item, index })}>
                        <div
                          className={styles.dropdownItem}
                          style={{
                            backgroundColor:
                              highlightedIndex === index ? "#e0f4ea" : ""
                          }}
                        >
                          {index}
                          {item.username}
                        </div>
                      </li>
                    ))}

                    {!itemsFiltered.length ? (
                      <li className={styles.noItemsFound}>
                        <h1 className={styles.notFoundTitle}>Not found.</h1>
                      </li>
                    ) : null}
                  </ul>
                ) : null}
              </div>
            );
          }}
        </Autocomplete>

        <h1 className={styles.title}>Here is the active items</h1>
        <ul>
          {this.state.selectedItem.map((item, index) => (
            <li key={index}>{item.username}</li>
          ))}
        </ul>
      </div>
    );
  }
}
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
