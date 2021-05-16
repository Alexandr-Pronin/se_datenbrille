import { App } from"../../App"

it('Test App to return Object App', () =>{
    let app = new App();
    expect(app).toBeInstanceOf(App);
});