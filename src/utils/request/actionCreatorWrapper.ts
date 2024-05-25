export default function actionCreatorWrapper(fn: any, dispatch: any) {
  return (...args: any[]) => {
    if (!fn || !dispatch) {
      return;
    }
    let action = fn(...args);
    if (action && action.type) {
      dispatch(action);
    }
  };
}
