export const wasteReducer = (state, action) => {
  switch (action.type) {
    case "add_residues":
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
        select_to_edit: action.payload.residue,
        add_quantity: false,
        sus_quantity: false,
      };

    case "select_to_add_rest":
      return {
        ...state,
        select_to_edit: action.payload.residue,
        add_quantity: action.payload.add_quantity,
        sus_quantity: action.payload.sus_quantity,
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
