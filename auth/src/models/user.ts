import mongoose from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
    email: string;
    password: string;
}


//declare document structue
interface UserDocument extends mongoose.Document{
    email: string;
    password: string;
}

//instantiate Model using the user document template
//making a build function to 
interface UserModel extends mongoose.Model<UserDocument> {
    build(attrs: UserAttrs): UserDocument;
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            const { _id, email } = ret;
            return  { id: _id, email };
        }
    }
});

userSchema.pre('save', async function(done){
    if( this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User }