import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAN+QjkrTy8/2N3rJU02GNU1yb4P09Wzj\n' +
  'Jkw/5LkcBUSFR6mC69DqZzEhEaKeAQSHmLhoNt6ScGq7+DM/oUXNZd8CAwEAAQ=='

const privateKey = 'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEA35COStPLz/Y3eslT\n' +
  'TYY1TXJvg/T1bOMmTD/kuRwFRIVHqYLr0OpnMSERop4BBIeYuGg23pJwarv4Mz+h\n' +
  'Rc1l3wIDAQABAkEAgTH3mPR2dtKx0wpfUpC5Yu071oUMA4XtTukpk3PG84YBW/Tm\n' +
  '4kBYidgYLPUJMQa28YgpOs9+dp718JBrpSiOuQIhAPlF/AokMrMmfACb6tRMWv/d\n' +
  'WAfiL9xjnB1jaumTeJCNAiEA5Zj40dKhM9q6youTTY5r/Lz57SR2r4m2vCk41IIW\n' +
  'gxsCICHTMlE5+js/JKJ8hdALEGoZ4gEn2zC/v4ZpYC+T2E9dAiBcuPmLq1ek3Gnh\n' +
  'UJrtkF32FM+OQNKZs7ETrkYgNGUpDwIgRMbJqHuQ49EyGS4X5fd48HorYRBXbvte\n' +
  '5Hj5cvGa2xo='

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}




// rsa.js

const pKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANpjEgIlpYAiNGDBtwfasJVENXnV5rDhVh+XadRyWkrR2naie1ym3ElrYs3V7bAZFkJaxA3pd0j/TGlQ0A2jLj0CAwEAAQ==';


// 使用公钥加密
export function pwdEncrypt(data) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(pKey); // 设置公钥
  const encrypted = encryptor.encrypt(data); // 加密数据
  if (!encrypted) {
    throw new Error('加密失败，请检查公钥是否正确');
  }
  return encrypted;
}


