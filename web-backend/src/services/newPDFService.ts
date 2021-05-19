import Protocol from "../entities/protocol";
import PDFDocument from "pdfkit";
import path from "path";
import PdfPrinter from "pdfmake";

export class NewPDFService {
  private obj: Protocol;
  private protocol: any;
  private doc: any;
  private content: any = [];
  constructor(obj: Protocol) {
    this.obj = obj;
    this.protocol = this.obj.value;
  }
  public parse = () => {
    var fonts = {
      Roboto: {
        normal: path.join(__dirname, `../res/fonts/Roboto-Regular.ttf`),
        bold: path.join(__dirname, `../res/fonts/Roboto-Medium.ttf`),
        italics: path.join(__dirname, `../res/fonts/Roboto-Italic.ttf`),
        bolditalics: path.join(
          __dirname,
          `../res/fonts/Roboto-MediumItalic.ttf`
        ),
      },
    };
    //Protokolltitel
    this.content.push({
      columns: [
        {
          width: "*",
          text: this.protocol.metadata.label,
          style: "header",
        },
        {
          width: 50,
          image: path.join(__dirname, `../res/img/lv_logo.png`),
        },
      ],
    });

    //Metadaten
    this.labelValue("Mitarbeiter", this.protocol.metadata.creator);

    //Inhalte
    this.protocol.entries.map((entry: any) => {
      if (entry.type === "number") {
        this.labelValue(entry.label, entry.value);
      }
      if (entry.type === "select") {
        this.select(entry.label, entry.possibleChoices, entry.choices);
      }
    });

    let docDefinition: any = {
      content: this.content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        //margins: [left, top, right, bottom]
        label: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        value: {
          fontSize: 14,
          bold: false,
          margin: [0, 10, 0, 5],
        },
        valueCheck: {
          fontSize: 10,
          bold: false,
          margin: [0, 12, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableOpacityExample: {
          margin: [0, 5, 0, 15],
          fillColor: "blue",
          fillOpacity: 0.3,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
    };

    let printer = new PdfPrinter(fonts);
    return printer.createPdfKitDocument(docDefinition);
  };

  private select = (label: string, possibleChoices: any, choices: any) => {
    let columns: any = [];
    columns.push({ width: "33%", text: label, style: "label" });
    possibleChoices.map((choice: any) => {
      columns.push({
        width: "auto",
        canvas:
          choices.indexOf(choice) === -1
            ? [{ type: "rect", x: 0, y: 0, w: 10, h: 10, lineWidth: 1 }]
            : [
                { type: "rect", x: 0, y: 0, w: 10, h: 10, lineWidth: 1 },
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 10,
                  y2: 10,
                  lineWidth: 1,
                  lineCap: "round",
                },
                {
                  type: "line",
                  x1: 10,
                  y1: 0,
                  x2: 0,
                  y2: 10,
                  lineWidth: 1,
                  lineCap: "round",
                },
              ],
        style: "valueCheck",
      });
      columns.push({
        width: "auto",
        text: choice,
        style: "valueCheck",
      });
    });
    this.content.push({
      columns: columns,
      columnGap: 10,
    });
  };

  private labelValue = (label: string, value: string) => {
    value === null && (value = "");
    value = value + "";
    value.trim().length === 0
      ? this.content.push({
          columns: [
            {
              width: "auto",
              text: label,
              style: "label",
            },
            {
              width: "auto",
              text: value,
              style: "value",
            },
            {
              width: "auto",
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 30,
                  x2: 200,
                  y2: 30,
                  lineWidth: 1,
                  lineCap: "round",
                },
              ],
            },
          ],
          columnGap: 10,
        })
      : this.content.push({
          columns: [
            {
              width: "auto",
              text: label,
              style: "label",
            },
            {
              width: "auto",
              text: value,
              style: "value",
            },
          ],
          columnGap: 10,
        });
  };
}
