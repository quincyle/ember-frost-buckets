# ember-frost-buckets
Ember addon for a "bucket" widget for use with Ciena-Frost.

## Usage
### Attributes
| Name | Description | Type | Required |
| ---- | ----------- | ---- | -------- |
| items | List of values to select | Array | Yes |
| selectedItems | A list of items that should already be selected|Array|No|
| hoveredItem | Sets hover on an item by its index. The property `isSelected` specifies which list to set the hovered item in | {index: number, isSelected: boolean} | No |
| titleAttr | Key to the main text to display for the item | string or number | No |
| subtitleAttr | Key to a subheading | string or number | No |
| valueAttr | Value key to use from each item | string or number | No |
| onChange | Handler that executes when the component changes the list of selected items | Function | No |

### Default Behavior
If titleAttr and subtitleAttr are not specified, the display tiles will show the value of the item and no subheading. When valueAttr is not specified, the value used will be the item itself. This is good for use with primitives.

```handlebars
{{frost-buckets
  items=items
}}
```

### Specifying display properties
For objects it is often more effective to specify a property to display instead of trying to display the stringified version of the object. To do this specify `titleAttr` (and `subtitleAttr` if you want a subheading). For example, if you have items:

```javascript
let item = {
  label: 'Hi, I am a label!',
  description: 'Hi, I am a description'
}
```
using the following:
```handlebars
{{frost-buckets
  items=items
  titleAttr='label'
  subtitleAttr='description'
}}
```
would make the tiles display the `label` as the main text and the `description` as the subheading.

### Setting the selected items
If you want to set the selected items to the `frost-buckets` component specify the `selectedItems` attribute. The component assumes that items are unique and selected items will not appear in the list of non-selected items.

### Reacting to changes
If an `onChange` function is specified, it will be called when the list is changed with the new list of selected values. This list is comprised of either the items themselves or the value specified by the `valueAttr` key. For example,

```javascript
let item = {
  label: 'Hi, I am a label!',
  description: 'Hi, I am a description',
  id: 'some-unique-id'
}
```
using the following:
```handlebars
{{frost-buckets
  items=items
  titleAttr='label'
  subtitleAttr='description'
  valueAttr='id'
}}
```
will mean that `onChange` is called with an array of the `id` properties of all the selected items.

## Development
### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
