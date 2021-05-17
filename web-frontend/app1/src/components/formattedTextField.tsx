import React from "react";
import { TextField } from "@material-ui/core";

interface FormattedTextFieldProps {
  label: string;
  onChange?: Function;
}

export default class FormattedTextField extends React.Component<
  FormattedTextFieldProps
> {
  state: { value: string; displayed: string } = { value: "", displayed: "" };

  onChange = event => {
    var value = event.target.value;
    value = value.toUpperCase();
    value = value.split("-").join("");
    value = value.split(" ").join("");

    var dispalyed = "";
    for (var i = 0; i < value.length; i++) {
      if (i !== 0 && i % 4 === 0) dispalyed += "-";
      dispalyed += value[i];
    }
    value.length <= 16 &&
      this.props.onChange &&
      this.props.onChange.call(this, value);
    value.length <= 16 && this.setState({ value: value, displayed: dispalyed });
  };

  render() {
    return (
      <>
        <TextField
          value={this.state.displayed}
          onChange={this.onChange.bind(this)}
          label={this.props.label}
          fullWidth
        />
      </>
    );
  }
}
