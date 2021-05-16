import React from "react";
import { render } from "react-dom";
import ProtocolTableEntry from "../../../models/protocolModels/protocolTableEntry";

export class ProtocolTableEntryView extends React.Component<{
  entry: ProtocolTableEntry;
}> {
  render() {
    return "Hallo Tabelle!";
  }
}
