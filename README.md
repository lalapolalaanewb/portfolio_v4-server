# Portfolio V4

Fourth version of my Portfolio (Server Side Only).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Software you need to install:-

- Node.js at [Node.org](https://nodejs.org/en/download/)
- Visual Studio Code at [Visual Studio Code](https://code.visualstudio.com/)
- or you can choose any Code Editor to your liking

```
Go to Node.org link above and choose your machine type (Please choose the **LTS download version** instead of the Current version):-
- Window, go for Windows Installer
- MacOS, go for MacOS Installer
```

### Installing

Please follow the step below to get the system running

1. After download or git repo the _Project file_. Place your _Project folder_ anywhere in your system (doesn't matter where actually)
2. Open your _Code Editor_ (Visual Studio Code or any other code editor)
3. Go to your _Terminal_ in Visual Studio Code or open _CMD - Command Prompt_, manuver to where your _Project folder_ located and do the following installation:- (make sure you already inside your Project folder. Eg: C:\parentFolder\ProjectFolder)

```
in your Terminal or CMD, it's gonna look like this:-
C:\parentFolder\ProjectFolder\>

```

- Install all dependencies required (for `server` folder as stated in `package.json`)
  - `server` folder
    - devDependencies:-
      - concurrently
      - nodemon
    - dependencies
      - @hapi/joi
      - bcryptjs
      - colors
      - connect-redis
      - dotenv
      - express
      - express-session
      - jsonwebtoken
      - mongoose
      - morgan
      - multer
      - nodemailer
      - redis

```
// for server dependencies installation
C:\parentFolder\ProjectFolder\> npm install / yarn install
```

- Once installation finishes with no errors. Then start the project (in development build - **this will run the server on port 5400**):-

```
C:\parentFolder\ProjectFolder\> npm run dev / yarn run build
```

## Important Notes

Below are some of the CRUD images available in the project (admin access only):-

![dashboard_light](https://lalapolalaanewb.com/images/readme_adminDemo_1.PNG#thumbnail_fw)
![posts_light](https://lalapolalaanewb.com/images/readme_adminDemo_2.PNG#thumbnail_fw)
![medias_light](https://lalapolalaanewb.com/images/readme_adminDemo_3.PNG#thumbnail_fw)
![abouts_light](https://lalapolalaanewb.com/images/readme_adminDemo_4.PNG#thumbnail_fw)
![resumes_light](https://lalapolalaanewb.com/images/readme_adminDemo_5.PNG#thumbnail_fw)
![posts_dark](https://lalapolalaanewb.com/images/readme_adminDemo_6.PNG#thumbnail_fw)

## Deployment

No additional support on how to deploy on live system for this project.

## Built With

- React
- Express
- Node
- MongoDB

## Contributing

No contribution allowed as of this moment of time.

## Authors

- **Lalapolalaa Newb**

## Acknowledgments

- [Academind](https://www.youtube.com/channel/UCSJbGtTlrDami-tDGPUV9-w)
- [Online Tutorials](https://www.youtube.com/channel/UCbwXnUipZsLfUckBPsC7Jog)
- [Traversy Media](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA)
- [DevEd](https://www.youtube.com/channel/UClb90NQQcskPUGDIXsQEz5Q)
- [Web Dev Simplifies](https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw)
- [DesignCourse](https://www.youtube.com/channel/UCVyRiMvfUNMA1UPlDPzG5Ow)
- [Coding Addict](https://www.youtube.com/channel/UCMZFwxv5l-XtKi693qMJptA)
- [The Net Ninja](https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg)
