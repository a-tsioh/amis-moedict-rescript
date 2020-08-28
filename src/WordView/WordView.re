[@react.component]
let make = (~word) => {
  let (stem, setStem) = React.useState(() => None);
  let stemPfx = {js|(詞幹:|js};
  <div className="ui segment">
    <h1> {React.string(word)} </h1>
    <h3>
      {Belt.Option.map(stem, s => {stemPfx ++ s ++ ")"})
       ->Belt.Option.getWithDefault("")
       ->React.string}
    </h3>
    <EntryView
      word
      dict="s"
      dictName={js|蔡中涵大辭典|js}
      color="blue"
      setStem
    />
    <EntryView
      word
      dict="p"
      dictName={js|方敏英字典|js}
      color="teal"
      setStem
    />
    <EntryView
      word
      dict="m"
      dictName={js|潘世光阿法|js}
      color="grey"
      setStem
    />
  </div>;
};