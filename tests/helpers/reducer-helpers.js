import _ from 'lodash'

export function stateDefaults() {
    return {
        hoveredItem: null,
        selectedItems: [],
        nonSelectedItems: [],
        allItems: [],
        titleAttr: 'title',
        subtitleAtrr: 'subtitle',
        valueAttr: 'id'
    }
}

export function stateFactory (defaultGen) {
    return (state) => {
        return _.defaults(state, defaultGen())
    }
}

export function generateDummyItems (firstIndex, numberOfItems) {
    const range = _.range(firstIndex, firstIndex + numberOfItems)
    return _.map(range, (index) => {
        return {
            title: 'Item ' + index,
            subtitle: '',
            id: 'item' + index
        }
    })
}
