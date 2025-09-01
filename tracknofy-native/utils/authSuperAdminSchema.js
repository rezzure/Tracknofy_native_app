import * as Yup from "yup";

//yup is just like a nomenclature 
//object() is a function
const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email formate"),

    password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),

    role : Yup.string().default('Super Admin'),

    name: Yup.string().default('Prabhat Rai'),

    status : Yup.string().default("Active")


})

export default validationSchema