import * as React from "react";
import { Rating, RatingProps } from "semantic-ui-react";

interface INewRatingProps {
  currentUser: any;
  myRating: any | undefined;
  handleRating: (rating: number) => Promise<{}>;
}

interface INewRatingState {
  rating: number;
}

class NewRating extends React.PureComponent<INewRatingProps, INewRatingState> {
  public state = {
    rating: 0,
  };

  private handleRatingChange = (event: React.MouseEvent<HTMLDivElement>, data: RatingProps) => {
    const { handleRating } = this.props;
    event.preventDefault();

    this.setState({
      rating: data.rating as number,
    });

    handleRating(data.rating as number);
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

    return <Rating onRate={this.handleRatingChange} maxRating={5} rating={targetRating} disabled={disabled} />;
  }
}

export default NewRating;
