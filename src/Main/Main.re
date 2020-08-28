type state =
  | LoadingIndex
  | Error
  | HasM(Trie.tree)
  | HasMandS(Trie.tree)
  | HasIndex(Trie.tree);

let populateIndex = (s: state): option(Trie.tree) => {
  switch (s) {
  | LoadingIndex => None
  | Error => None
  | HasIndex(i) => Some(i)
  | _ => None
  };
};

[@react.component]
let make = () => {
  let (s, setState) = React.useState(() => LoadingIndex);
  let (searchedWord, setSearch) = React.useState(() => "");
  let (word, selectWord) = React.useState(() => "");
  let fetchOne =
      (
        url: string,
        existingIndex: option(Trie.tree),
        nextState: Trie.tree => state,
      ) => {
    Js.log(url);
    Js.Promise.(
      Fetch.fetch(url)
      |> then_(Fetch.Response.json)
      |> then_(json => Js.Json.decodeArray(json) |> resolve)
      |> then_(opt => Belt.Option.getExn(opt) |> resolve)
      |> then_(items =>
           items
           |> Js.Array.map(i => i->Js.Json.decodeString->Belt.Option.getExn)
           |> resolve
         )
      |> then_(wordList => {
           setState(_previousState =>
             nextState(
               Trie.buildPrefixTrie(
                 wordList |> ArrayLabels.to_list,
                 existingIndex,
               ),
             )
           );
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
      switch (s) {
      | LoadingIndex =>
        Js.log("refetch");
        fetchOne("./statics/data/m/index.json", None, i => HasM(i));
        None;
      | HasM(idx) =>
        fetchOne("./statics/data/s/index.json", Some(idx), i => HasMandS(i));
        None;
      | HasMandS(idx) =>
        fetchOne("./statics/data/p/index.json", Some(idx), i => HasIndex(i));
        None;
      | _ => None
      }
    },
    [|s|],
  );
  <div style={ReactDOMRe.Style.make(~width="100%", ())}>
    <Menu placeholder="Search for a word" onSearchChange=setSearch />
    <div className="ui grid">
      <div className="four wide column">
        <SearchResults
          data={populateIndex(s)}
          query=searchedWord
          onClickWord=selectWord
        />
      </div>
      <div className="twelve wide column"> <WordView word /> </div>
    </div>
  </div>;
};