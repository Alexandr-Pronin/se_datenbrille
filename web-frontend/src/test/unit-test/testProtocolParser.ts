import { ProtocolParserV1, ParserError } from "../../parser/protocolParserV1";
import { Protocol } from "../../models/protocolModels/protocol";
import { ProtocolNumberEntry } from "../../models/protocolModels/protocolNumberEntry";
import { ProtocolEntry } from "../../models/protocolModels/protocolEntry";
import { ProtocolSelectEntry } from "../../models/protocolModels/protocolSelectEntry";

/** Json */
let protocolJsonCorrect: any = {
  protocol: {
    metadata: {
      completionDate: new Date(),
      creator: "David Massanek",
      parserVersion: "v1",
      receiptDate: new Date(),
      version: 2,
      label: "Testprotokoll"
    },
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: 2,
        config: {
          minValue: 1,
          maxValue: 2
        }
      }
    ]
  }
};

let protocolJsonMissingConfig: any = {
  protocol: {
    metadata: {
      completionDate: new Date(),
      creator: "David Massanek",
      parserVersion: "v1",
      receiptDate: new Date(),
      version: 2,
      label: "Testprotokoll"
    },
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: 2
      }
    ]
  }
};

let protocolJsonMissingVersion: any = {
  protocol: {
    metadata: {
      completionDate: new Date(),
      creator: "David Massanek",
      parserVersion: "v1",
      receiptDate: new Date(),
      label: "Testprotokoll"
    },
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: 2,
        config: {
          minValue: 1,
          maxValue: 2
        }
      }
    ]
  }
};

let protocolJsonMissingReceiptDate: any = {
  protocol: {
    metadata: {
      completionDate: new Date(),
      creator: "David Massanek",
      parserVersion: "v1",
      version: 2,
      label: "Testprotokoll"
    },
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: 2,
        config: {
          minValue: 1,
          maxValue: 2
        }
      }
    ]
  }
};

let protocolJsonMissingParserVersion: any = {
  protocol: {
    metadata: {
      completionDate: new Date(),
      creator: "David Massanek",
      receiptDate: new Date(),
      version: 2,
      label: "Testprotokoll"
    },
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: 2,
        config: {
          minValue: 1,
          maxValue: 2
        }
      }
    ]
  }
};

let protocolJsonMissingCreator: any = {
  protocol: {
    metadata: {
      completionDate: new Date(),
      parserVersion: "v1",
      receiptDate: new Date(),
      version: 2,
      label: "Testprotokoll"
    },
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: 2,
        config: {
          minValue: 1,
          maxValue: 2
        }
      }
    ]
  }
};

let protocolJsonMissingCompletionDate: any = {
protocol: {
  metadata: {
    creator: "David Massanek",
    parserVersion: "v1",
    receiptDate: new Date(),
    version: 2,
    label: "Testprotokoll"
  },
  entries: [
    {
      label: "Achsenabstand",
      type: "number",
      value: 2,
      config: {
        minValue: 1,
        maxValue: 2
      }
    }
  ]
}
};

/** Json */
let protocolJsonMissingLabel: any = {
  protocol: {
    metadata: {
      completionDate: new Date(),
      creator: "David Massanek",
      parserVersion: "v1",
      receiptDate: new Date(),
      version: 2,
    },
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: 2,
        config: {
          minValue: 1,
          maxValue: 2
        }
      }
    ]
  }
};

let protocolJsonWrongEntrieType: any = {
  protocol: {
    metadata: {
      completionDate: new Date(),
      creator: "David Massanek",
      parserVersion: "v1",
      receiptDate: new Date(),
      version: 2,
      label: "Testprotokoll"
    },
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: 2,
        config: {
          minValue: 1,
          maxValue: 2
        }
      }
    ]
  }
};

/** end json */
it("Test ProtocolParser returns Protocol", () => {
  let parsed = new ProtocolParserV1(protocolJsonCorrect).parse();
  expect(parsed).toBeInstanceOf(Protocol);
});

it("Test ProtocolParser returns ParserError", () => {
  let parsed: ParserError | Protocol = new ProtocolParserV1(
    protocolJsonMissingConfig
  ).parse();
  expect(parsed).toBeInstanceOf(ParserError);
});

it("Test ProtocolParser returns missing config", () => {
  let parsed: ParserError | Protocol = new ProtocolParserV1(
    protocolJsonMissingConfig
  ).parse();
  let parseError: ParserError = new ParserError([]);
  if (parsed instanceof ParserError) {
    parseError = parsed;
  }
  expect(
    parseError.messages.indexOf(
      "Missing or incorrect field 'protocol.entries' or its content."
    )
  ).not.toBe(-1);
});

it("Test ProtocolParser retruns missing version", () => {
  let parsed: ParserError | Protocol = new ProtocolParserV1(protocolJsonMissingVersion).parse();
  let parseError: ParserError = new ParserError([]);
  if (parsed instanceof ParserError){
    parseError = parsed;
  }
  expect(
    parseError.messages.indexOf(
      "Missing field 'version' in protocol.metadata"
    )
  ).not.toBe(-1);
})

it("Test ProtocolParser retruns missing receipt date", () => {
  let parsed: ParserError | Protocol = new ProtocolParserV1(protocolJsonMissingReceiptDate).parse();
  let parseError: ParserError = new ParserError([]);
  if (parsed instanceof ParserError){
    parseError = parsed;
  }
  expect(
    parseError.messages.indexOf(
      "Missing field 'receiptDate' in protocol.metadata, or wrong type. Type must be DATE."
    )
  ).not.toBe(-1);
})

it("Test ProtocolParser retruns missing parser version", () => {
  let parsed: ParserError | Protocol = new ProtocolParserV1(protocolJsonMissingParserVersion).parse();
  let parseError: ParserError = new ParserError([]);
  if (parsed instanceof ParserError){
    parseError = parsed;
  }
  expect(
    parseError.messages.indexOf(
      "Missing field 'parserVersion' in protocol.metadata"
    )
  ).not.toBe(-1);
})

it("Test ProtocolParser retruns missing creator", () => {
  let parsed: ParserError | Protocol = new ProtocolParserV1(protocolJsonMissingCreator).parse();
  let parseError: ParserError = new ParserError([]);
  if (parsed instanceof ParserError){
    parseError = parsed;
  }
  expect(
    parseError.messages.indexOf(
      "Missing field 'creator' in protocol.metadata"
    )
  ).not.toBe(-1);
})

it("Test ProtocolParser returns missing comletion Date", () => {
  let parsed: ParserError | Protocol = new ProtocolParserV1(protocolJsonMissingCompletionDate).parse();
  let parseError: ParserError = new ParserError([]);
  if(parsed instanceof ParserError){
    parseError = parsed;
  }
  expect(
    parseError.messages.indexOf(
      "Missing field 'completionDate' in protocol.metadata, or wrong type. Type must be DATE."
    )
  ).not.toBe(-1);
})

it("Test ProtocolParser returns missing lable", () =>{
  let parsed: ParserError | Protocol = new ProtocolParserV1(protocolJsonMissingLabel).parse();
  let parseError: ParserError = new ParserError([]);
  if(parsed instanceof ParserError){
    parseError = parsed;
  }
  expect(
    parseError.messages.indexOf(
      "Missing field 'label' in protocol.metadata"
    )
  ).not.toBe(-1);
})


it("Test blaaaa", () =>{
  let parsed: ParserError | Protocol = new ProtocolParserV1(protocolJsonWrongEntrieType).parse();
  let protocol: Protocol = new Protocol();
  if(parsed instanceof Protocol){
    protocol = parsed;
  }
  if(protocol.entries instanceof ProtocolEntry){
    protocol.entries.map((entry, index) =>{
      if(entry.type === "number"){
        expect(entry).toBeInstanceOf(ProtocolNumberEntry)
      }
      /*
      if(index == 1){
        expect(entry).toBeInstanceOf(ProtocolSelectEntry)
      }
      */
    })
  }
});