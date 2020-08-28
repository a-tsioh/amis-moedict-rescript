open Belt;

type tree = {
  isWord: bool,
  children: Belt.Map.String.t(tree),
};

let emptyTree = {isWord: false, children: Belt.Map.String.empty};

let rec logTree = (t: tree, indentN: int) => {
  Js.log(Js.String.repeat(indentN, " ") ++ Js.String.make(t.isWord));
  Belt.Map.String.forEach(
    t.children,
    (k, v) => {
      Js.log(Js.String.repeat(indentN, " ") ++ k);
      logTree(v, indentN + 2);
    },
  );
};

let collectWordsByPrefix = (prefix: string, dict: tree) => {
  let letters = Js.String.split("", prefix)->ArrayLabels.to_list;
  let rec findSubTree = (toRead: list(string), current: tree) => {
    switch (toRead) {
    | [] => Some(current)
    | [l, ...tail] =>
      switch (Belt.Map.String.get(current.children, l)) {
      | None => None
      | Some(subTree) => findSubTree(tail, subTree)
      }
    };
  };
  let rec collectAllInSubTree =
          (dict: tree, read: list(string), acc: Belt.Set.String.t) => {
    let newAcc =
      if (dict.isWord) {
        let w: string =
          Js.String.concatMany(ArrayLabels.of_list(List.reverse(read)), "");
        Belt.Set.String.add(acc, w);
      } else {
        acc;
      };
    let subAccs: array(Belt.Set.String.t) =
      Belt.Map.String.mapWithKey(dict.children, (l, subDict) => {
        collectAllInSubTree(subDict, [l, ...read], Belt.Set.String.empty)
      })
      |> Belt.Map.String.valuesToArray;
    Js.List.foldLeft(
      (. a, b) => Belt.Set.String.union(a, b),
      newAcc,
      ArrayLabels.to_list(subAccs),
    );
  };
  switch (findSubTree(letters, dict)) {
  | None => Belt.Set.String.empty
  | Some(subTree) =>
    collectAllInSubTree(
      subTree,
      List.reverse(letters),
      Belt.Set.String.empty,
    )
  };
};

let addWord =
  (. dict: tree, word: string) => {
    let letters = Js.String.split("", word)->ArrayLabels.to_list;
    let rec aux = (toRead: list(string), dict: tree) => {
      switch (toRead) {
      | [] => {...dict, isWord: true}
      | [l, ...tail] =>
        switch (Belt.Map.String.get(dict.children, l)) {
        | None => {
            ...dict,
            children:
              Belt.Map.String.set(
                dict.children,
                l,
                aux(tail, {isWord: false, children: Belt.Map.String.empty}),
              ),
          }
        | Some(subDict) => {
            ...dict,
            children:
              Belt.Map.String.set(dict.children, l, aux(tail, subDict)),
          }
        }
      };
    };
    let dict = aux(letters, dict);
    dict;
  };

let buildPrefixTrie = (words: list(string), idx: option(tree)) => {
  Js.log("rebuild trie");
  Js.List.foldLeft(addWord, Option.getWithDefault(idx, emptyTree), words);
};