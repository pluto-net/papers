import * as React from "react";
import { Rating, RatingProps } from "semantic-ui-react";
import { IRating } from "../../../both/model/rating";

interface INewRatingProps {
  currentUser: any;
  myRating: IRating | undefined;
  handleRating: (rating: number) => Promise<{}> | undefined;
  handleOpenSignUpDialog: () => void;
}

interface INewRatingState {
  rating: number;
}

class NewRating extends React.PureComponent<INewRatingProps, INewRatingState> {
  public state = {
    rating: 0,
  };

  private handleRatingChange = (event: React.MouseEvent<HTMLDivElement>, data: RatingProps) => {
    const { handleRating, currentUser, handleOpenSignUpDialog } = this.props;

    event.preventDefault();

    if (!currentUser) {
      return handleOpenSignUpDialog();
    }

    handleRating(data.rating as number);

    this.setState({
      rating: data.rating as number,
    });
  };

  public render() {
    const { myRating } = this.props;
    const { rating } = this.state;

    let targetRating: number;
    if (myRating && myRating.rating >= 0) {
      targetRating = myRating.rating;
    } else {
      targetRating = rating;
    }

    return <Rating icon="star" size="huge" onRate={this.handleRatingChange} maxRating={5} rating={targetRating} />;
  }
}

export default NewRating;
