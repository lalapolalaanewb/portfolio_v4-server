/* Dependencies Import                                                 ***/
// 1. Nodemailer
const nodemailer = require('nodemailer')
// 2. Path Handler
const path = require('path')

/** Page Specific State & Function */
const transportData = (contact) => {
    return {
        // Service 
        service: 'Gmail',
        // Auth
        auth: {
            type: 'OAuth2',
            // Email use to send email (Your Google Email. Eg: xxx@gmail.com)
            user: contact.userGmail,
            // Get in Google Console API (GMAIL API)
            clientId: contact.clientId,
            // Get in Google Console API (GMAIL API)
            clientSecret: contact.clientSecret,
            // Get from Google OAuth2.0 Playground (Using Cliet ID & Client Secret Key)
            refreshToken: contact.refreshToken
        }
    }
}

/* GMAIL Configuration Setup                                           ***/
// Send a email copy to CLIENT (Send Auto Reply on Contact)
async function contactAutoReplyClientNoty(contact, client) { console.log(contact); console.log(client)
    // - Create Nodemailer TRANSPORT INFO
    let transport = nodemailer.createTransport(transportData(contact))

    // concerns function for MAIL
    let concernsFunction = (concern) => {
        let concernTemplate = `
            <li><b>${concern}</b></li>
        `

        return concernTemplate
    }

    // - body of Message
    let mailBody = `
        <div>
            <p>Hi! <b>${client.name}</b></p>
            <p>Thank you for reaching us at https://lalapolalaanewb.com</p>
        </div>
        <div>
            <p>Below are your message to us: </p>
            <div>
                <ul>
                    <li>Subject: <b>${client.subject}</b></li>
                    <li>Concern: </li>
                    <ul>
                        ${client.concerns.map(concernsFunction).join("")}
                    </ul>
                    <li>Message : </li>
                    <b>${client.message}</b>
                </ul>
            </div>
        </div>
        <div>
            <p>We will reach out to you within 24 hours. Please be patience and kindly wait for our reply.</p>
            <p>Again, thank you for reaching us.</p>
        </div>
        <div>
            <p>Sincerely,</p>
            <p>LpNb [<b>Lalapolalaa Newb</b>]</p>
        </div>
    `

    // - Create BODY of mail
    let mailOptions = {
        // Email should be SAME as USER EMAIL above     
        from: `LpNb <${contact.userEmail}>`,
        // ANY Email to send the mail (to send to many use ',' inside the single quote. Eg: 'xxx@gmail.com, xxx@yahoo.com')
        to: client.email,
        subject: `[Lalapolalaa Newb] ${client.subject}`,
        // TEXT cannot apply any HTML Elements (use either TEXT or HTML)
        // text: 'Hey there, it’s our first message sent with Nodemailer ',
        // HTML can apply any HTML Elements (use either TEXT or HTML)
        html: mailBody
    }

    // send email
    return await transport.sendMail(mailOptions)
    .then(success => 'Successful!')
    .catch(err => {
        console.log(err)
        return 'Unsuccesful!'
    })
}

// Send a email copy to ADMIN (Send Auto Reply on Contact)
async function contactAutoReplyAdminNoty(contact, admin, client) { console.log(contact); console.log(admin); console.log(client)
    // - Create Nodemailer TRANSPORT INFO
    let transport = nodemailer.createTransport(transportData(contact))

    // concerns function for MAIL
    let concernsFunction = (concern) => {
        let concernTemplate = `
            <li><b>${concern}</b></li>
        `

        return concernTemplate
    }

    // - body of Message
    let mailBody = `
        <div>
            <p>Hi! <b>${admin.name}</b></p>
        </div>
        <div>
            <p>Below are <b>${client.name}</b> message to us: </p>
            <div>
                <ul>
                    <li>Email: <b>${client.email}</b></li>
                    <li>Subject: <b>${client.subject}</b></li>
                    <li>Concern: </li>
                    <ul>
                        ${client.concerns.map(concernsFunction).join("")}
                    </ul>
                    <li>Message : </li>
                    <b>${client.message}</b>
                </ul>
            </div>
        </div>
        <div>
            <p>Email Notification from [<a href="https://www.lalapolalaanewb.com" target="_blank"><b>Lalapolalaa Newb Website</b></a>]</p>
        </div>
    `

    // - Create BODY of mail
    let mailOptions = {
        // Email should be SAME as USER EMAIL above     
        from: `LpNb <${contact.senderEmail}>`,
        // ANY Email to send the mail (to send to many use ',' inside the single quote. Eg: 'xxx@gmail.com, xxx@yahoo.com')
        to: admin.email,
        subject: `[Lalapolalaa Newb] ${client.subject}`,
        // TEXT cannot apply any HTML Elements (use either TEXT or HTML)
        // text: 'Hey there, it’s our first message sent with Nodemailer ',
        // HTML can apply any HTML Elements (use either TEXT or HTML)
        html: mailBody
    }

    // send email
    return await transport.sendMail(mailOptions)
    .then(success => 'Successful!')
    .catch(err => {
        console.log(err)
        return 'Unsuccesful!'
    })
}

// Send a email copy to CLIENT (Send Auto Reply on Newsletter Subscription)
async function subsAutoReplyClientNoty(contact, client) { console.log(contact); console.log(client)
    // - Create Nodemailer TRANSPORT INFO
    let transport = nodemailer.createTransport(transportData(contact))

    // - body of Message
    let mailBody = `
        <div>
            <p>Hi!</p>
            <p>Thank you for subscribing to our newsletter at https://lalapolalaanewb.com</p>
        </div>
        <div>
            <p>We will let you know of any future events.</p>
            <p>Again, thank you for reaching us.</p>
        </div>
        <div>
            <p>Sincerely,</p>
            <p>LpNb [<b>Lalapolalaa Newb</b>]</p>
        </div>
    `

    // - Create BODY of mail
    let mailOptions = {
        // Email should be SAME as USER EMAIL above     
        from: `LpNb <${contact.userEmail}>`,
        // ANY Email to send the mail (to send to many use ',' inside the single quote. Eg: 'xxx@gmail.com, xxx@yahoo.com')
        to: client.email,
        subject: `[Lalapolalaa Newb] Newsletter Subscriptions`,
        // TEXT cannot apply any HTML Elements (use either TEXT or HTML)
        // text: 'Hey there, it’s our first message sent with Nodemailer ',
        // HTML can apply any HTML Elements (use either TEXT or HTML)
        html: mailBody
    }

    // send email
    return await transport.sendMail(mailOptions)
    .then(success => 'Successful!')
    .catch(err => {
        console.log(err)
        return 'Unsuccesful!'
    })
}

// Send a email copy to ADMIN (Send Auto Reply on Subscription)
async function subsAutoReplyAdminNoty(contact, admin, client) { console.log(contact); console.log(admin); console.log(client)
    // - Create Nodemailer TRANSPORT INFO
    let transport = nodemailer.createTransport(transportData(contact))

    // - body of Message
    let mailBody = `
        <div>
            <p>Hi! <b>${admin.name}</b></p>
        </div>
        <div>
            <p>${client.email} just subscribed to our newsletter!</p>
        </div>
        <div>
            <p>Email Notification from [<a href="https://www.lalapolalaanewb.com" target="_blank"><b>Lalapolalaa Newb Website</b></a>]</p>
        </div>
    `

    // - Create BODY of mail
    let mailOptions = {
        // Email should be SAME as USER EMAIL above     
        from: `LpNb <${contact.senderEmail}>`,
        // ANY Email to send the mail (to send to many use ',' inside the single quote. Eg: 'xxx@gmail.com, xxx@yahoo.com')
        to: admin.email,
        subject: `[Lalapolalaa Newb] Newsletter Subscription Noty`,
        // TEXT cannot apply any HTML Elements (use either TEXT or HTML)
        // text: 'Hey there, it’s our first message sent with Nodemailer ',
        // HTML can apply any HTML Elements (use either TEXT or HTML)
        html: mailBody
    }

    // send email
    return await transport.sendMail(mailOptions)
    .then(success => 'Successful!')
    .catch(err => {
        console.log(err)
        return 'Unsuccesful!'
    })
}

/* GMAIL Configuration Setup Export                                    ***/

module.exports = {
    contactAutoReplyClientNoty,
    contactAutoReplyAdminNoty,
    subsAutoReplyClientNoty,
    subsAutoReplyAdminNoty
} 