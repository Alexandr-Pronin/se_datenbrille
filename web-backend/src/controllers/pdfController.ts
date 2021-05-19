import Request from "../interfaces/request";
import { Response } from "express";
import { NewPDFService } from "../services/newPDFService";
import Protocol from "../entities/protocol";
import Template from "../entities/template";

export const templateToPdf = async (req: Request, res: Response) => {
  Template.findOne({ id: Number(req.params.id), user_id: req.user.id })
    .then((template: Template) => {
      let protocol: Protocol = new Protocol();
      protocol.value = template.value;
      let doc = new NewPDFService(protocol).parse();
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);
      doc.end();
      //res.end();
    })
    .catch(() => {
      res.sendStatus(400).end();
    });
};

export const testTemplateToPdf = async (req: Request, res: Response) => {
  let testProtocolObject: any = {
    entries: [
      {
        label: "Achsenabstand",
        type: "number",
        value: null,
        config: {
          maxValue: 120,
          minValue: 100,
        },
      },
      {
        label: "Achsenabstand 2",
        type: "number",
        value: 100,
        config: {
          maxValue: 120,
          minValue: 100,
        },
      },
      {
        label: "Welche Checks wurden durchgeführt?",
        type: "select",
        choices: ["Check 1", "Check 3"],
        possibleChoices: ["Check 1", "Check 2", "Check 3", "Check 4"],
        config: {
          minChoices: 1,
          maxChoices: 4,
        },
      },
    ],
    metadata: {
      creator: "",
      parserVersion: "v1",
      version: 0,
      completionDate: null,
      receiptDate: null,
      label: "Testprotokoll",
    },
  };
  let testProtocol: Protocol = new Protocol();
  testProtocol.value = testProtocolObject;

  let doc = new NewPDFService(testProtocol).parse();
  doc.pipe(res);
  doc.end();
};
