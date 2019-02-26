import React, { Component } from "react"
import PropTypes from "prop-types"
import ReactSelect, { createFilter } from "react-select"
import {
  values,
  isString,
  isNumber,
  join,
  filter,
  compose,
  property,
  flatMap,
  pathEq
} from "lodash/fp"

const customTheme = theme => ({
  ...theme,
  borderRadius: 0,
  spacing: {
    ...theme.spacing,
    baseUnit: 2,
    controlHeight: 34
  }
})

const customStyles = props => ({
  control: (base, _state) => ({
    ...base,
    borderColor: props.hasError ? "#FB3A2F" : base.borderColor
  }),
  groupHeading: (base, _state) => ({
    ...base,
    color: "black",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "100%"
  })
})

const filterOption = createFilter({
  stringify: compose(
    join(" "),
    filter(value => isString(value) || isNumber(value)),
    values,
    property("data")
  )
})

export default class Select extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array,
    hasError: PropTypes.bool,
    onChange: PropTypes.func.isRequired
  }

  static findOptionByValue = (selectOptions, value) => {
    const options = flatMap(
      option => (option.options ? option.options : option),
      selectOptions
    )

    return options.find(pathEq("value", value)) || null
  }

  constructor(props) {
    super(props)
    this.select = React.createRef()
  }

  handleChange = option => {
    const { name, onChange } = this.props
    const { value } = option
    onChange({ target: { name, value } })
  }

  handleKeyDown = event => {
    if (!this.select.current) {
      return
    }

    if (!this.select.current.state.menuIsOpen && event.key === 'Enter') {
      this.select.current.setState({ menuIsOpen: true })
    }
  }

  render() {
    const { value, ...passThroughProps } = this.props

    return (
      <ReactSelect
        {...passThroughProps}
        ref={this.select}
        value={Select.findOptionByValue(this.props.options, value)}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        filterOption={filterOption}
        theme={customTheme}
        styles={customStyles(this.props)}
      />
    )
  }
}
