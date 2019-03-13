import React from 'react';

class Register extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        };
    };

    onNameChange = (event) => {
        this.setState({ name: event.target.value });
    };

    onEmailChange = (event) => {
        this.setState({ email: event.target.value });
    };

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value });
    };

    onSubmitSignin = () => {
        /* fetch por padrao usa uma requisição GET! Mas aqui precisa ser via POST por causa dos dados do usuário */
        fetch('https://evening-journey-21143.herokuapp.com/register', {
            //precisa por isso para pegar o POST
            method: 'post',
            headers: {'Content-Type' : 'application/json'},
            // Nao podemos passar um objeto JS para o backend e sim um JSON... precisa converter para JSON para enviar!
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        }) /* Mandou a requisição e pegamos o retorno para ver o que aconteceu */
        .then( response => response.json())
        /* Se existe esse usuário no banco de dados o backend retorna success para o front */
        .then( user => {
            /* Como existe o usuário podemos alterar a rota para home e sair de register */
            if(user.id) {
                this.props.loadUser(user);
                this.props.onRouteChange('home'); 
            }
        })        
    };

    render() {        
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Register</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="text" 
                                    name="name"  
                                    id="name"                                    
                                    onChange= { this.onNameChange }    
                                />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address"  
                                    id="email-address"                                     
                                    onChange= { this.onEmailChange }
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input 
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password"  
                                    id="password"                                     
                                    onChange= { this.onPasswordChange }
                                />
                            </div>                        
                        </fieldset>
                        <div className="">
                            <input                                 
                                onClick = { this.onSubmitSignin }
                                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                type="submit" 
                                value="Register"
                            />
                        </div>                    
                    </div>
                </main>
            </article>
        )//return
    }//render    
}//Register
    
export default Register;