import { GET_USER, UPLOAD_STATS } from "../actions/user.actions";

interface stateProps {
  pseudo?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
  password?: string;
  picture?: string;
  bio?: string;
  friendRequestSend?: [string];
  friendRequestReceived?: [string];
  friends?: [string];
  hobbies?: [string];
  isAdmin?: boolean;
  userInterestedIn?: [string];
}
const initialState: stateProps = {};

export default function userReducer(state = initialState, action: any) {
  switch (action.type) {
    case GET_USER:
      return action.payload;
    case UPLOAD_STATS:
      return action.payload;
    default:
      return state;
  }
}
