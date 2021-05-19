import { Request, Response } from "express";

/**
 * GET /api/mock
 * JSON-Protocol Mock
 */
export const index = (req: Request, res: Response) => {
  res.json({
    protocol: {
      meta: {
        parser: "v1",
        name: "Protokoll Test",
        version: "29",
        creator: "David"
      },
      content: [
        {
          type: "number",
          label: "Fahrzeugnummer",
          value: 296,
          config: {
            min: 0,
            max: 300
          }
        },
        {
          type: "number",
          label: "Leeres Feld",
          value: null,
          config: {
            min: 0,
            max: 300
          }
        },
        {
          type: "select",
          label: "Maßnahmen",
          config: {
            minSelect: 0,
            maxSelect: 1
          },
          answers: [
            {
              label: "Maßnahme 1",
              selected: false
            },
            {
              label: "Maßnahme 2",
              selected: false
            }
          ]
        }
      ]
    }
  });
};
