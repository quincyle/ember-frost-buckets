import {expect} from 'chai'
import reducer from 'ember-frost-buckets/reducer'
import * as actions from 'ember-frost-buckets/actions'
import {
    stateFactory,
    DummyType,
    stateDefaults,
    generateDummyItems
} from 'dummy/tests/helpers/reducer-helpers'
import _ from 'lodash'

const createState = stateFactory(stateDefaults)

describe('Double click action', function () {
    it('moves a non-selected item to the list of selected items', function () {
        const initialState = createState({
            selectedItems: generateDummyItems(1, 1),
            nonSelectedItems: generateDummyItems(2, 1)
        })
        expect(reducer(initialState, actions.doubleClickItem(false, 0))).to.be.eql(createState({
            nonSelectedItems: [],
            selectedItems:[
                {title:'Item 1' , subtitle: '', id:'item1'},
                {title:'Item 2' , subtitle: '', id:'item2'}
            ]
        }))
    })
    it('moves a selected item to the list of non-selected items', function () {
        const initialState = createState({
            selectedItems: generateDummyItems(1, 1),
            nonSelectedItems: generateDummyItems(2, 1)
        })
        expect(reducer(initialState, actions.doubleClickItem(true, 0))).to.be.eql(createState({
            nonSelectedItems: [
                {title:'Item 2' , subtitle: '', id:'item2'},
                {title:'Item 1' , subtitle: '', id:'item1'}
            ],
            selectedItems:[]
        }))
    })
})

describe('Click action', function () {
    it('sets a hovered item in the non-selected item list', function () {
        const index = 2
        const initialState = createState({
            nonSelectedItems: generateDummyItems(1, 3)
        })

        const expectedHoveredItem = {index, isSelected: false}
        const state = reducer(initialState, actions.clickItem(index, false))
        expect(state.hoveredItem).to.be.eql(expectedHoveredItem)
    })
    it('works on the selected item list as well', function () {
        const index = 2
        const initialState = createState({
            selectedItems: generateDummyItems(1, 3)
        })
        const expectedHoveredItem = {index, isSelected: true}
        const state = reducer(initialState, actions.clickItem(index, true))
        expect(state.hoveredItem).to.be.eql(expectedHoveredItem)
    })
})

describe('Hover next action', function () {
    describe('selects the next item in', function () {
        let initialState
        let items
        beforeEach(function () {
            items = generateDummyItems(1, 3)
            initialState = createState({
                hoveredItem: {index: 1, isSelected: true}
            })
        })
        it('the non-selected list', function () {
            initialState.nonSelectedItems = items
            if (initialState.hoveredItem !== null) {
                initialState.hoveredItem.isSelected = false
            }
            const state = reducer(initialState, actions.hoverNextItem())
            expect(state.hoveredItem).to.eql({index: 2, isSelected: false})
        })
        it('the selected list', function () {
            initialState.selectedItems = items
            const state = reducer(initialState, actions.hoverNextItem())
            expect(state.hoveredItem).to.eql({index: 2, isSelected: true})
        })
    })
    it('does not select past the end of the list', function () {
        const items = generateDummyItems(1, 3)
        const initialState = createState({
            hoveredItem: {index: 2, isSelected: true},
            selectedItems: items
        })
        const state = reducer(initialState, actions.hoverNextItem())
        expect(state.hoveredItem).to.eql({index: 2, isSelected: true})
    })
})

describe('Hover previous action', function () {
    describe('selects the previous item in', function () {
        let initialState
        let items
        beforeEach(function () {
            items = generateDummyItems(1, 3)
            initialState = createState({
                hoveredItem: {index: 2, isSelected: true}
            })
        })
        it('the non-selected list', function () {
            initialState.nonSelectedItems = items
            if (initialState.hoveredItem !== null) {
                initialState.hoveredItem.isSelected = false
            }
            const state = reducer(initialState, actions.hoverPrevItem())
            expect(state.hoveredItem).to.eql({index: 1, isSelected: false})
        })
        it('the selected list', function () {
            initialState.selectedItems = items
            const state = reducer(initialState, actions.hoverPrevItem())
            expect(state.hoveredItem).to.eql({index: 1, isSelected: true})
        })
    })
    it('does not select past the beginning of the list', function ()  {
        const items = generateDummyItems(1, 3)
        const initialState = createState({
            hoveredItem: {index: 0, isSelected: true},
            selectedItems: items
        })
        const state = reducer(initialState, actions.hoverPrevItem())
        expect(state.hoveredItem).to.eql({index: 0, isSelected: true})
    })
})

describe('Clear hover action', function () {
    it('sets the hovered item to null', function () {
        const initialState = createState({
            hoveredItem: {index: 0, isSelected: true},
            selectedItems: generateDummyItems(1, 3)
        })
        const state = reducer(initialState, actions.clearHover())
        expect(state.hoveredItem).to.be.null
    })
})

describe('Select item action', function () {
    it('moves the item at specified index selected items list', function () {
        const items = generateDummyItems(1, 3)
        const initialState = createState({
            hoveredItem: {index: 0, isSelected: false},
            nonSelectedItems: items
        })
        const state = reducer(initialState, actions.selectItem(1))
        const expectedSelected = [items[1]]
        const expectedNotSelected = [items[0], items[2]]
        expect(state.selectedItems).to.be.eql(expectedSelected)
        expect(state.nonSelectedItems).to.be.eql(expectedNotSelected)
    })
})

describe('Deselect item action', function () {
    it('moves the hovered item from the selected item list to the non-selected items list', function () {
        const items = generateDummyItems(1, 3)
        const initialState = createState({
            selectedItems: items
        })
        const state = reducer(initialState, actions.deselectItem(1))
        const expectedNotSelected = [items[1]]
        const expectedSelected = [items[0], items[2]]
        expect(state.selectedItems).to.be.eql(expectedSelected)
        expect(state.nonSelectedItems).to.be.eql(expectedNotSelected)
    })
})

describe('Select hover action', function () {
    it('selects the hovered item if it is not selected', function () {
        const items = generateDummyItems(1, 3)
        const initialState = createState({
            hoveredItem: {index: 1, isSelected: false},
            nonSelectedItems: _.clone(items)
        })
        const state = reducer(initialState, actions.selectHover())
        const expectedSelected = [items[1]]
        const expectedNotSelected = [items[0], items[2]]
        expect(state.selectedItems).to.be.eql(expectedSelected)
        expect(state.nonSelectedItems).to.be.eql(expectedNotSelected)
    })
    it('deselects the hovered item if it is selected', function () {
        const items = generateDummyItems(1, 3)
        const initialState = createState({
            hoveredItem: {index: 1, isSelected: true},
            selectedItems: _.clone(items)
        })
        const state = reducer(initialState, actions.selectHover())
        const expectedNotSelected = [items[1]]
        const expectedSelected = [items[0], items[2]]
        expect(state.selectedItems).to.be.eql(expectedSelected)
        expect(state.nonSelectedItems).to.be.eql(expectedNotSelected)
    })
    it('clears the hovered item', function () {
        const items = generateDummyItems(1, 3)
        const initialState = createState({
            hoveredItem: {index: 1, isSelected: true},
            selectedItems: _.clone(items)
        })
        const state = reducer(initialState, actions.selectHover())
        const expectedNotSelected = [items[1]]
        const expectedSelected = [items[0], items[2]]
        expect(state.hoveredItem).to.be.null
    })
    it('does nothing if no item is hovered', function () {
        const items = generateDummyItems(1, 3)
        const initialState = createState({
            selectedItems: items
        })
        const state = reducer(initialState, actions.selectHover())
        const expectedNotSelected = [items[1]]
        const expectedSelected = [items[0], items[2]]
        expect(state).to.be.eql(initialState)
    })
})
