[@react.component]
let make = (~placeholder, ~onSearchChange) =>
  <div className="ui menu">
    <div className="item">
      <div className="ui icon input">
        <input
          type_="text"
          placeholder
          onChange={e => onSearchChange(ReactEvent.Form.target(e)##value)}
        />
        <i className="search icon" />
      </div>
    </div>
    <div className="right item"> {React.string("Coucou")} </div>
  </div>;