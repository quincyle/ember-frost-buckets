import _ from 'lodash'
export function maybeAction (action, ...args) {
  if (_.isFunction(action)) {
    action(...args)
  }
}
