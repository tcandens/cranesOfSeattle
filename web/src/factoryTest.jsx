const factoryComponent = function({React}) {
  return function Component (props) {
    return {
      render() {
        return (
          <h1>Here is a React component with zero class!</h1>
        );
      }
    };
  };
};

export default factoryComponent
