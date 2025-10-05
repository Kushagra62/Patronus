import * as yup from 'yup';

const userSchema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required')
});

export default userSchema;