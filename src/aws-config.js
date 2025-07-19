import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: 'eu-west-1',
      userPoolId: 'eu-west-1_YRUreAXbZ',
      userPoolClientId: '723an4s8e1fakv78nrvsrb7cf8',
    }
  }
};

Amplify.configure(awsConfig);

export default awsConfig;