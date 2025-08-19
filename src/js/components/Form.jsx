import React, { Component } from "react"
import PropTypes from "prop-types"
import Select from "components/Select"
import { formatDate } from "utils"
import cn from "classnames"
import StopWatchIcon from "components/shared/StopWatchIcon"

class Form extends Component {
  static propTypes = {
    changeset: PropTypes.shape({
      assignment_id: PropTypes.number.isRequired,
      billable: PropTypes.bool.isRequired,
      date: PropTypes.string.isRequired,
      task_id: PropTypes.number.isRequired,
      description: PropTypes.string,
      remote_id: PropTypes.string,
      remote_service: PropTypes.string,
      remote_url: PropTypes.string,
      seconds: PropTypes.number,
      hours: PropTypes.string,
    }).isRequired,
    errors: PropTypes.object,
    descriptionMandatory: PropTypes.bool.isRequired,
    projects: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  isValid() {
    const { changeset } = this.props
    const descriptionWithoutTag = changeset.description.replace(/^#\S+/, "").trim()
    return (
      ["assignment_id", "task_id"].map((prop) => changeset[prop]).every(Boolean) &&
      (changeset.date === formatDate(new Date()) || changeset.seconds > 0) &&
      ((this.props.descriptionMandatory && descriptionWithoutTag) ||
        !this.props.descriptionMandatory)
    )
  }

  get isTimerStartable() {
    const {
      changeset: { seconds, date },
    } = this.props

    return date === formatDate(new Date()) && seconds === 0
  }

  buttonStyle() {
    const styleMap = {
      true: {
        border: "none",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        marginTop: "22px",
        transition: "all 0.2s ease-in-out",
      },
      false: {
        border: "none",
        width: "50px",
        height: "36px",
        marginTop: "35px",
        transition: "all 0.2s ease-in-out",
      },
    }

    return styleMap[this.isTimerStartable]
  }

  handleTextareaKeyDown = (event) => {
    const { onSubmit } = this.props

    if (event.key === "Enter") {
      event.preventDefault()
      this.isValid() && onSubmit(event)
    }
  }

  render() {
    const { projects, changeset, errors, onChange, onSubmit } = this.props
    const project = Select.findOptionByValue(projects, changeset.assignment_id)

    return (
      <form onSubmit={onSubmit}>
        <div
          className={cn("form-group", {
            "has-error": errors.assignment_id || errors.task_id,
          })}
        >
          <Select
            className="moco-bx-select"
            name="assignment_id"
            placeholder="Auswählen..."
            options={projects}
            value={changeset.assignment_id}
            hasError={!!errors.assignment_id}
            onChange={onChange}
          />
          <Select
            className="moco-bx-select"
            name="task_id"
            placeholder="Auswählen..."
            options={project?.tasks || []}
            value={changeset.task_id}
            onChange={onChange}
            hasError={!!errors.task_id}
            noOptionsMessage={() => "Zuerst Projekt wählen"}
          />
          {errors.assignment_id ? (
            <div className="form-error">{errors.assignment_id.join("; ")}</div>
          ) : null}
          {errors.task_id ? <div className="form-error">{errors.task_id.join("; ")}</div> : null}
        </div>
        <div className={cn("form-group", { "has-error": errors.hours })}>
          <input
            name="hours"
            className="form-control"
            onChange={onChange}
            value={changeset.hours}
            placeholder="0:00"
            autoComplete="off"
            tabIndex={0}
            autoFocus
          />
          {errors.hours ? <div className="form-error">{errors.hours.join("; ")}</div> : null}
        </div>
        <div className={cn("form-group", { "has-error": errors.description })}>
          <textarea
            name="description"
            onChange={onChange}
            value={changeset.description}
            placeholder={`Beschreibung der Tätigkeit${this.props.descriptionMandatory ? "" : " – optional"}`}
            maxLength={500}
            rows={3}
            onKeyDown={this.handleTextareaKeyDown}
          />
          {errors.description ? (
            <div className="form-error">{errors.description.join("; ")}</div>
          ) : null}
        </div>

        <button
          type="submit"
          className="moco-bx-btn"
          disabled={!this.isValid()}
          style={this.buttonStyle()}
        >
          {this.isTimerStartable ? <StopWatchIcon /> : "OK"}
        </button>
      </form>
    )
  }
}

export default Form
