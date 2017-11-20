import * as React from "react";
import { Rating, RatingProps } from "semantic-ui-react";

interface INewRatingProps {
  currentUser: any;
  myRating: any | undefined;
  handleRating: (rating: number) => Promise<{}>;
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
    handleRating(data.rating as number);

    if (!currentUser) {
      return handleOpenSignUpDialog();
    }

    this.setState({
      rating: data.rating as number,
    });
  };

  public render() {
    const { myRating } = this.props;
    const { rating } = this.state;

    let targetRating: number;
    let disabled: boolean = false;
    if (myRating && myRating.rating >= 0) {
      disabled = true;
      targetRating = myRating.rating;
    } else {
      targetRating = rating;
    }

    return (
      <Rating icon="star" onRate={this.handleRatingChange} maxRating={5} rating={targetRating} disabled={disabled} />
    );
  }
}

export default NewRating;
