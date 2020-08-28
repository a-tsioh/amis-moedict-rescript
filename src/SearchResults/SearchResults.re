include List;

let rec generateSubstrings: string => list(string) =
  s => {
    let result =
      if (String.length(s) < 3) {
        [s];
      } else {
        let substrings =
          generateSubstrings(String.sub(s, 0, String.length(s) - 1));
        [s, ...substrings];
      };
    result;
  };

let filterExistingWords = (w: string) =>
  switch (Dom_storage.getItem(w, Dom_storage.localStorage)) {
  | None => false
  | Some(_) => true
  };

[@react.component]
let make = (~data, ~query, ~onClickWord) => {
  let results =
    switch (data) {
    | None => []
    | Some(t) => Trie.collectWordsByPrefix(query, t)->Belt.Set.String.toList
    };
  <div className="ui segment">
    <div className="ui bulleted divided list">
      //  <div className="item"> {React.string(query)} </div> </div>;

        {List.map(
           (w: string) => {
             <a
               href="#"
               className="item"
               key=w
               onClick={_ => onClickWord(_ => w)}>
               {React.string(w)}
             </a>
           },
           results,
         )
         ->ArrayLabels.of_list
         ->Belt.Array.slice(~offset=0, ~len=100)
         ->React.array}
      </div>
  </div>;
};