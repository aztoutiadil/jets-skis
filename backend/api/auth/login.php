<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

class Auth {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($email, $password) {
        try {
            $query = "SELECT id, name, email, password, role FROM users WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":email", $email);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if(password_verify($password, $row['password'])) {
                    // Create session
                    session_start();
                    $_SESSION['user_id'] = $row['id'];
                    $_SESSION['role'] = $row['role'];

                    return array(
                        "success" => true,
                        "user" => array(
                            "id" => $row['id'],
                            "name" => $row['name'],
                            "email" => $row['email'],
                            "role" => $row['role']
                        )
                    );
                } else {
                    return array("error" => "Invalid password");
                }
            } else {
                return array("error" => "User not found");
            }
        } catch(PDOException $e) {
            return array("error" => $e->getMessage());
        }
    }
}

// Handle login request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    $auth = new Auth($db);

    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->email) && isset($data->password)) {
        echo json_encode($auth->login($data->email, $data->password));
    } else {
        echo json_encode(array("error" => "Missing email or password"));
    }
}
?>
