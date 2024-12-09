import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_9rnpzax';
const EMAILJS_TEMPLATE_ID = 'template_z2wjtna';
const EMAILJS_PUBLIC_KEY = 'eF2duAHHBzfpPbHF4';

interface EmailParams {
  to_email: string;
  user_name: string;
  user_email: string;
  approve_url: string;
  reject_url: string;
}

interface PasswordResetEmailParams {
  to_email: string;
  reset_url: string;
  user_name: string;
}

export const sendApprovalEmail = async (params: EmailParams) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: params.to_email,
        user_name: params.user_name,
        user_email: params.user_email,
        approve_url: params.approve_url,
        reject_url: params.reject_url,
        date: new Date().toLocaleDateString()
      },
      EMAILJS_PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (params: PasswordResetEmailParams) => {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'template_password_reset', // Create this template in EmailJS
      {
        to_email: params.to_email,
        reset_url: params.reset_url,
        user_name: params.user_name,
        date: new Date().toLocaleDateString()
      },
      EMAILJS_PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('Password reset email sending failed:', error);
    throw error;
  }
};