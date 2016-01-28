const helloFactory = function ({ React }) {
  return function Hello(props) {
    Hello.propTypes = {
      word: React.PropTypes.string
    };

    return {
      props,
      componentDidUpdate() {
        this.refs.wordInput.getDOMNode().focus();
      },
      render() {

        const onKeyUp = e => {
          if (e.key !== 'Enter') return;
          this.props.word = e.target.value;
          this.render();
        };

        return (
          <p>Fuck you,&nbsp;
            <span>Fucker</span>
            <input
              ref='wordInput'
              placeholder={this.props.word}
              onKeyUp={onKeyUp} />
          </p>
        );
      }
    };
  };
};

export default helloFactory;
