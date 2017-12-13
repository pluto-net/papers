import * as React from "react";
import { IPost } from "../../../../both/model/post";
import { DateFilter } from "..";
import { Tab } from "semantic-ui-react";

interface IIcoList {
  posts: IPost[];
  dateFilter: DateFilter;
  getIcoList: () => JSX.Element | undefined;
  handleTabChange: (e: any, data: any) => void;
}

class IcoList extends React.Component<IIcoList, {}> {
  public shouldComponentUpdate(nextProps: IIcoList) {
    return this.props.posts !== nextProps.posts;
  }

  public render() {
    const { getIcoList, dateFilter, handleTabChange } = this.props;

    const panes = [
      { menuItem: "CURRENT", render: () => <Tab.Pane className="ico-list-wrapper">{getIcoList()}</Tab.Pane> },
      { menuItem: "UPCOMING", render: () => <Tab.Pane className="ico-list-wrapper">{getIcoList()}</Tab.Pane> },
      { menuItem: "PAST", render: () => <Tab.Pane className="ico-list-wrapper">{getIcoList()}</Tab.Pane> },
      { menuItem: "ALL", render: () => <Tab.Pane className="ico-list-wrapper ">{getIcoList()}</Tab.Pane> },
    ];

    const activeIndex = panes.findIndex(pane => pane.menuItem.toLowerCase() === dateFilter);

    return (
      <div className="home-tab-wrapper">
        <Tab className="home-tab-menu" onTabChange={handleTabChange} activeIndex={activeIndex} panes={panes} />
      </div>
    );
  }
}

export default IcoList;
