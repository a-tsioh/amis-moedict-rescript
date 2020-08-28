type definition = {
  glose: string, //f
  examples: option(array(string)), //e
  synonyms: option(array(string)), //s
  references: option(array(string)), //r
  type_: option(string) //t ?
};

type heteronym = {
  name: option(string),
  defs: array(definition),
};

type entry = {
  term: string,
  stem: option(string),
  tag: option(string),
  het: array(heteronym),
};

type state =
  | Init
  | Fetched(entry)
  | Error;

let decodeOptionArrayString = (json: Js.Json.t) => {
  json
  ->Js.Json.decodeArray
  ->Belt.Option.map(a =>
      a
      |> Js.Array.map(x => {
           Js.Json.decodeString(x)->Belt.Option.getWithDefault("")
         })
    );
};

let decodeDefinition = (json: Js_json.t) => {
  let def = json->Js.Json.decodeObject->Belt.Option.getExn;
  {
    glose: def->Js.Dict.unsafeGet("f")->Js.String2.make,
    examples: def->Js.Dict.unsafeGet("e")->decodeOptionArrayString,
    synonyms: def->Js.Dict.unsafeGet("s")->decodeOptionArrayString,
    references: def->Js.Dict.unsafeGet("r")->decodeOptionArrayString,
    type_: def->Js.Dict.get("t")->Belt.Option.flatMap(Js.Json.decodeString),
  };
};

let decodeHet = (json: Js.Json.t) => {
  let h = json->Js.Json.decodeObject->Belt.Option.getExn;
  {
    name: Js.Dict.get(h, "name")->Belt.Option.map(Js.String2.make),
    defs:
      Js.Dict.get(h, "d")
      ->Belt.Option.flatMap(Js.Json.decodeArray)
      ->Belt.Option.map(Array.map(decodeDefinition))
      ->Belt.Option.getWithDefault([||]),
  };
};

let decodeEntry = (json: Js.Json.t) => {
  Js.Json.decodeObject(json)
  ->Belt_Option.map(obj =>
      {
        term:
          Belt_Option.getWithDefault(
            Js.Dict.get(obj, "t")->Belt_Option.map(Js.String2.make),
            "???",
          ),
        stem: Js.Dict.get(obj, "stem")->Belt_Option.map(Js.String2.make),
        tag: None,
        het:
          obj
          ->Js.Dict.get("h")
          ->Belt.Option.flatMap(Js.Json.decodeArray)
          ->Belt.Option.map(Array.map(decodeHet))
          ->Belt.Option.getWithDefault([||]),
      }
    );
};

[@react.component]
let make = (~word, ~dict, ~dictName, ~color, ~setStem) => {
  let (s, setState) = React.useState(() => Init);
  let fetchEntry = () => {
    let url = "./statics/data/" ++ dict ++ "/" ++ word ++ ".json";
    Js.Promise.(
      Fetch.fetch(url)
      |> then_(Fetch.Response.json)
      |> then_(json => {
           Js.log(json);
           switch (decodeEntry(json)) {
           | Some(e) =>
             Js.log(e);
             setState(_ => Fetched(e));
           | None => ()
           };
           Js.Promise.resolve();
         })
      |> catch(_err => {
           setState(_previousState => Error);
           Js.Promise.resolve();
         })
      |> ignore
    );
  };
  React.useEffect1(
    () => {
      fetchEntry();
      None;
    },
    [|word|],
  );
  React.useEffect1(
    () => {
      switch (s) {
      | Fetched(e) =>
        switch (e.stem) {
        | Some(s) => setStem(_ => Some(s))
        | None => ()
        }
      | _ => ()
      };
      None;
    },
    [|s|],
  );
  <div className="ui container segment">
    <div className={"ui large " ++ color ++ " top attached label"}>
      {React.string(dictName)}
    </div>
    {switch (s) {
     | Fetched(e) =>
       <div className="ui list">
         {React.array(
            Array.mapi(
              (hi, h) => {
                <div className="item" key={Js.String.make(hi)}>
                  <div className="ui ordered list">
                    {React.array(
                       Array.mapi(
                         (di, d) =>
                           <div className="item" key={Js.String.make(di)}>
                             <div className="header">
                               {React.string(d.glose)}
                             </div>
                             <div className="content">
                               <div className="ui bullet list">
                                 {switch (d.examples) {
                                  | Some(examples) =>
                                    Array.mapi(
                                      (exi, ex) =>
                                        <div
                                          className="item"
                                          key={Js.String2.make(exi)}>
                                          {React.string(ex)}
                                        </div>,
                                      examples,
                                    )
                                    ->React.array
                                  | None => <div />
                                  }}
                               </div>
                             </div>
                           </div>,
                         h.defs,
                       ),
                     )}
                  </div>
                </div>
              },
              e.het,
            ),
          )}
       </div>
     //            )}
     | _ => <div className="ui message"> {React.string("not found")} </div>
     }}
  </div>;
};