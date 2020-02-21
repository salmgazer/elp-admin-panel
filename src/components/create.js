import React , {Component} from 'react';
import {Button, Form, Input, message} from 'antd';
import Api from '../services/Api.js';
import styles from '../assets/css/create.module.scss';

/*const CustomizedForm = Form.create({
    name: 'global_state',
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            brandname: Form.createFormField({
                ...props.brandname,
                value: props.brandname.value,
            }),
        };
    },
    onValuesChange(_, values) {
        console.log(values);
    },
})(props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form layout="inline" onSubmit={this.onValuesChange}>
            <Form.Item label="Brand name:">
                {getFieldDecorator('brandname', {
                    rules: [{ required: true, message: 'Brand name is required!' }],
                })(<Input />)}
            </Form.Item>
            <Button type="primary" htmlType="submit"> Add </Button>
        </Form>
    );
});

class Create extends Component {
    state = {
        fields: {
            brandname: {
                value: 'Vitamilk',
            },
        },
    };

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    render() {
        const { fields } = this.state;
        return (
            <div>
                <CustomizedForm {...fields} onChange={this.handleFormChange} />
                <pre className="language-bash">{JSON.stringify(fields, null, 2)}</pre>
            </div>
        );
    }
}*/



class ContactForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'brands',
            name: '',
            email:''
        };

        this.handleChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        //console.log('Change detected. State updated' + name + ' = ' + value);
    }

    handleSubmit(event) {

        new Api(this.state.page).create(this.state.name).then((res) => {
            message.success('Brand name : '+this.state.name+' has been successfully added!');
        });
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} layout="inline">
                    <div className="form-group">
                        <label for="nameImput">Brand name : </label>
                        <input type="text" name="name" className={styles.form_fields} value={this.state.name} onChange={this.handleChange} id="nameImput" placeholder="Name" />
                        <Button type="primary" htmlType="submit"> Add </Button>
                    </div>

                </form>
            </div>
        )
    }
}


class MainTitle extends Component {
    render(){
        return(
            <h1>Add Brand</h1>
        )
    }
}

class Create extends Component {
    render(){
        return(
            <div>
                <MainTitle/>
                <ContactForm/>
            </div>
        )
    }
}

export default Create;