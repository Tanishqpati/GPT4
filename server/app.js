const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post('/generate', async (req, res) => {
  try {
    console.log(process.env.OPENAI_API_KEY);
    const userPrompt = req.body.prompt; // Get the prompt from the request

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a frontend developer tasked with updating the values in the provided example code. You'll receive two files: Button.js and styles.css. In the styles.css file, replace the values of the CSS variables with those given by the user in the prompt. Update styles.css according to the modifications given by the user. And in response don't forget to include the Button.js file. Give full code of both files after updating

          Example Button.js code:
          import React from 'react';
          import PropTypes from 'prop-types';
          import classNames from 'classnames';
          import './styles.css';

          const BUTTON_TYPES = {
            PRIMARY: 'primary',
            SECONDARY: 'secondary',
            TEXT: 'text',
            ELEVATED: 'elevated',
          };

          const BUTTON_SIZES = {
            SMALL: 'small',
            MEDIUM: 'medium',
            LARGE: 'large',
          };

          const Button = ({ children, type, size, disabled, onClick }) => {
            const buttonClasses = classNames('button', 'button-${'type'}', 'button-${'size'}', {
              'button-disabled': disabled,
            });

            const handleClick = () => {
              if (!disabled && onClick) {
                onClick();
              }
            };

            return (
              <button className={buttonClasses} onClick={handleClick} disabled={disabled}>
                {children}
              </button>
            );
          };

          Button.propTypes = {
            children: PropTypes.node.isRequired,
            type: PropTypes.oneOf(Object.values(BUTTON_TYPES)).isRequired,
            size: PropTypes.oneOf(Object.values(BUTTON_SIZES)).isRequired,
            disabled: PropTypes.bool,
            onClick: PropTypes.func,
          };

          Button.defaultProps = {
            disabled: false,
          };

          export default Button;

          Example styles.css code:
          :root {
            --primary-color: #479a63;
            --secondary-color: #ffffff;
            --button-hover-color: #257b2d;
            --button-pressed-color: #0f5523;
            --button-disabled-color: rgba(71, 154, 99, 0.435);
            --padding-vertical: 20px;
            --padding-horizontal: 20px;
            --button-height-small: 40px;
            --button-height-medium: 48px;
            --button-height-large: 80px;
            --button-width-small: 117px;
            --button-width-medium: 149px;
            --button-width-large: 200px;
            --border-radius: 10px;
            --font-size-small: 20px;
            --font-size-medium: 28px;
            --font-size-large: 40px;
            --box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            --font-family: 'Inter';
          }

          .button {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: var(--padding-vertical) var(--padding-horizontal);
            border: none;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            border-radius: var(--border-radius);
            font-family: var(--font-family);
          }

          .button-primary {
            background-color: var(--primary-color);
            color: var(--secondary-color);
          }

          .button-secondary {
            background-color: transparent;
            color: var(--primary-color);
            border: 2px solid var(--primary-color);
          }

          .button-text {
            background-color: transparent;
            color: var(--primary-color);
          }

          .button-elevated {
            background-color: var(--primary-color);
            color: var(--secondary-color);
            box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
          }

          .button-small {
            font-size: var(--font-size-small);
            height: var(--button-height-small);
            width: var(--button-width-small);
          }

          .button-medium {
            font-size: var(--font-size-medium);
            height: var(--button-height-medium);
            width: var(--button-width-medium);
          }

          .button-large {
            font-size: var(--font-size-large);
            height: var(--button-height-large);
            width: var(--button-width-large);
          }

          .button-disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .button-primary:hover:not([disabled]) {
            background-color: var(--button-hover-color);
          }

          .button-secondary:hover:not([disabled]) {
            background-color: var(--button-disabled-color);
          }

          .button-text:hover:not([disabled]) {
            background-color: var(--button-disabled-color);
          }

          .button-elevated:hover:not([disabled]) {
            background-color: var(--button-hover-color);
          }

          .button:active:not([disabled]) {
            background-color: var(--button-pressed-color);
            color: var(--secondary-color);
          }
          `,
        },
        { role: "user", content: userPrompt }, // Use the user's prompt here
      ],
      model: "gpt-4",
      response_format: { type: "text" },
    });

    const generatedCode = completion.choices[0].message.content;
    console.log(generatedCode);
    res.json({ code: generatedCode });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const port = 3001; // Change if you need to
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
