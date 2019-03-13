import React from 'react';

class SignIn extends React.Component  {    

    constructor(props) {
        super(props);
        this.state = {
            signinEmail: '',
            signinPassword: ''
        };
    };

    onEmailChange = (event) => {
        this.setState({ signinEmail: event.target.value });
    };

    onPasswordChange = (event) => {
        this.setState({ signinPassword: event.target.value });
    };

    /* Envia os dados email e password para o backend usando fetch */
    onSubmitSignin = () => {
        /* fetch por padrao usa uma requisição GET! Mas aqui precisa ser via POST por causa dos dados do usuário */
        fetch('https://evening-journey-21143.herokuapp.com/signin', {
            //precisa por isso para pegar o POST
            method: 'post',
            headers: {'Content-Type' : 'application/json'},
            // Nao podemos passar um objeto JS para o backend e sim um JSON... precisa converter para JSON para enviar!
            body: JSON.stringify({
                email: this.state.signinEmail,
                password: this.state.signinPassword
            })
        }) /* Mandou a requisição e pegamos o retorno para ver o que aconteceu */
        .then( response => response.json())
        /* Se existe esse usuário no banco de dados o backend retorna success para o front */
        .then( user => {
            /* Como existe o usuário podemos alterar a rota para home e sair de signin */
            if( user.id ) {
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            }
        })
        
    };

    render() {
        //fazer destructing! senao tem que usar this.props.onRouteChange nos onlicks
        const { onRouteChange } = this.props;
        return(
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address"  
                                    id="email-address" 
                                    onChange= {this.onEmailChange}
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input 
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password"  
                                    id="password"
                                    onChange= {this.onPasswordChange}
                                />
                            </div>                        
                        </fieldset>
                        <div className="">
                            <input 
                                //esse onclick com essa arrow function so pega qnd for clicado!! precisa ter arrow function
                                //senao tiver a arrow function ele vai executar sozinha a função sem ser chamada no click!
                                onClick = { this.onSubmitSignin }
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="submit" 
                                value="Sign in"
                            />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick = { () => onRouteChange('register') } className="f6 link dim black db pointer">Register</p>                       
                        </div>
                    </div>
                </main>
            </article>
        );
    }//render
}//class

export default SignIn;