export const ordersReducer = (state, action) => {
  switch (action.type) {
    case "add_orders":
      return {
        ...state,
        list: {
          ...state.list,
          results: action.payload.results,
          count: action.payload.count,
        },
      };

    case "update_list":
      return {
        ...state,
        list: {
          ...state.list,
          countUpdate: state.list.countUpdate + 1,
        },
      };

    case "select_to_edit":
      return {
        ...state,
        select_to_edit: action.payload.order,
      };

    case "change_page":
      return {
        ...state,
        list: {
          ...state.list,
          page: action.page,
        },
      };

    default:
      return state;
  }
};
