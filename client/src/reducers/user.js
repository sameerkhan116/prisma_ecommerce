const ADD_USER = 'ADD_USER';

export const addUser = user => ({
  type: ADD_USER,
  user,
});

export default(state = [], { type, user }) => {
  switch (type) {
    case ADD_USER:
      return user;
    default:
      return state;
  }
};

