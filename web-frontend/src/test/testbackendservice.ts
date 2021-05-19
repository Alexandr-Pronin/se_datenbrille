import { BackendService } from "../backendservice"

it('Test backendservice1 to return Object Backendservice', () =>{
    let bes = new BackendService();
    expect(bes).toBeInstanceOf(BackendService);
});

