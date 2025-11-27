<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Adjust these paths if your PHPMailer installation is different (e.g., via Composer)
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow CORS if needed
header('Access-Control-Allow-Methods: POST');

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// Collect and sanitize POST data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$userSubject = isset($_POST['subject']) ? trim($_POST['subject']) : 'New Contact Inquiry';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// --- VALIDATIONS ---

// 1. Check for empty fields
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Name, Email, and Message are required fields.']);
    exit;
}

// 2. Validate Email Format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

// 3. Length Validations
if (strlen($name) < 2 || strlen($name) > 100) {
    echo json_encode(['success' => false, 'message' => 'Name must be between 2 and 100 characters.']);
    exit;
}

if (strlen($userSubject) > 200) {
    echo json_encode(['success' => false, 'message' => 'Subject must not exceed 200 characters.']);
    exit;
}

if (strlen($message) < 10) {
    echo json_encode(['success' => false, 'message' => 'Message is too short. Please provide more details.']);
    exit;
}

// 4. Basic Anti-Spam (Honey Pot - optional, requires frontend field)
// if (!empty($_POST['website'])) { exit; } 

// --- EMAIL SENDING ---

$mail = new PHPMailer(true);

try {
    // SMTP server configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'romastony0@gmail.com';
    $mail->Password = 'zjoxrfhgahwqwrfo'; // App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // 1. Send Notification to Admin (You)
    $mail->setFrom('romastony0@gmail.com', 'Portfolio Contact Form'); // Sender
    $mail->addAddress('romastony0@gmail.com', 'Romas Tony P'); // Recipient (You)
    $mail->addReplyTo($email, $name); // Reply to the user
    
    $mail->isHTML(true);
    $mail->Subject = 'New Message: ' . htmlspecialchars($userSubject);
    $mail->Body = "
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
        <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
        <p><strong>Subject:</strong> " . htmlspecialchars($userSubject) . "</p>
        <p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>
    ";
    $mail->AltBody = "Name: $name\nEmail: $email\nSubject: $userSubject\nMessage:\n$message";
    
    $mail->send();

    // 2. Send Auto-Reply to User
    $mail->clearAddresses();
    $mail->clearReplyTos();
    $mail->addAddress($email, $name);
    $mail->Subject = 'Thank you for contacting Romas Tony Paul';
    $mail->Body = "
        <p>Hi " . htmlspecialchars($name) . ",</p>
        <p>Thank you for reaching out. I have received your message regarding <strong>" . htmlspecialchars($userSubject) . "</strong>.</p>
        <p>I will get back to you shortly.</p>
        <br>
        <p>Best regards,<br><strong>Romas Tony Paul</strong><br>Software Developer</p>
    ";
    $mail->AltBody = "Hi $name,\n\nThank you for reaching out. I have received your message regarding '$userSubject'.\n\nI will get back to you shortly.\n\nBest regards,\nRomas Tony Paul";
    
    $mail->send();

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully!']);

} catch (Exception $e) {
    // Log error internally if needed
    // error_log($mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => "Message could not be sent. Please try again later."]);
}
?>
