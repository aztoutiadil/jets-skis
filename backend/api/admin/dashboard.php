<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

class AdminDashboard {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get dashboard statistics
    public function getStats() {
        try {
            // Get total revenue
            $revenue_query = "SELECT SUM(amount) as total_revenue FROM revenue WHERE payment_status = 'completed'";
            $revenue_stmt = $this->conn->prepare($revenue_query);
            $revenue_stmt->execute();
            $revenue_result = $revenue_stmt->fetch(PDO::FETCH_ASSOC);

            // Get total bookings
            $bookings_query = "SELECT COUNT(*) as total_bookings FROM bookings";
            $bookings_stmt = $this->conn->prepare($bookings_query);
            $bookings_stmt->execute();
            $bookings_result = $bookings_stmt->fetch(PDO::FETCH_ASSOC);

            // Get active users
            $users_query = "SELECT COUNT(*) as active_users FROM users WHERE role = 'user'";
            $users_stmt = $this->conn->prepare($users_query);
            $users_stmt->execute();
            $users_result = $users_stmt->fetch(PDO::FETCH_ASSOC);

            return array(
                "total_revenue" => $revenue_result['total_revenue'] ?? 0,
                "total_bookings" => $bookings_result['total_bookings'] ?? 0,
                "active_users" => $users_result['active_users'] ?? 0
            );
        } catch(PDOException $e) {
            return array("error" => $e->getMessage());
        }
    }

    // Get monthly revenue data
    public function getRevenueData() {
        try {
            $query = "SELECT 
                        DATE_FORMAT(payment_date, '%Y-%m') as month,
                        SUM(amount) as revenue
                     FROM revenue 
                     WHERE payment_status = 'completed'
                     GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
                     ORDER BY month DESC
                     LIMIT 6";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            return array("error" => $e->getMessage());
        }
    }

    // Get bookings distribution
    public function getBookingsDistribution() {
        try {
            $query = "SELECT 
                        vehicle_type,
                        COUNT(*) as count
                     FROM bookings
                     GROUP BY vehicle_type";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            return array("error" => $e->getMessage());
        }
    }

    // Get recent bookings
    public function getRecentBookings() {
        try {
            $query = "SELECT 
                        b.id,
                        u.name as user_name,
                        b.vehicle_type,
                        b.booking_date,
                        b.status,
                        b.total_amount
                     FROM bookings b
                     JOIN users u ON b.user_id = u.id
                     ORDER BY b.created_at DESC
                     LIMIT 10";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            return array("error" => $e->getMessage());
        }
    }

    // Update booking status
    public function updateBookingStatus($booking_id, $status) {
        try {
            $query = "UPDATE bookings 
                     SET status = :status 
                     WHERE id = :booking_id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":booking_id", $booking_id);
            
            return $stmt->execute();
        } catch(PDOException $e) {
            return array("error" => $e->getMessage());
        }
    }

    // Delete booking
    public function deleteBooking($booking_id) {
        try {
            // First delete related revenue records
            $revenue_query = "DELETE FROM revenue WHERE booking_id = :booking_id";
            $revenue_stmt = $this->conn->prepare($revenue_query);
            $revenue_stmt->bindParam(":booking_id", $booking_id);
            $revenue_stmt->execute();

            // Then delete the booking
            $booking_query = "DELETE FROM bookings WHERE id = :booking_id";
            $booking_stmt = $this->conn->prepare($booking_query);
            $booking_stmt->bindParam(":booking_id", $booking_id);
            
            return $booking_stmt->execute();
        } catch(PDOException $e) {
            return array("error" => $e->getMessage());
        }
    }
}

// Handle API requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    $admin = new AdminDashboard($db);

    $action = $_GET['action'] ?? '';

    switch($action) {
        case 'stats':
            echo json_encode($admin->getStats());
            break;
        case 'revenue':
            echo json_encode($admin->getRevenueData());
            break;
        case 'distribution':
            echo json_encode($admin->getBookingsDistribution());
            break;
        case 'bookings':
            echo json_encode($admin->getRecentBookings());
            break;
        default:
            echo json_encode(array("error" => "Invalid action"));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    $admin = new AdminDashboard($db);

    $data = json_decode(file_get_contents("php://input"));
    
    if (isset($data->action)) {
        switch($data->action) {
            case 'update_status':
                if (isset($data->booking_id) && isset($data->status)) {
                    echo json_encode($admin->updateBookingStatus($data->booking_id, $data->status));
                } else {
                    echo json_encode(array("error" => "Missing parameters"));
                }
                break;
            case 'delete_booking':
                if (isset($data->booking_id)) {
                    echo json_encode($admin->deleteBooking($data->booking_id));
                } else {
                    echo json_encode(array("error" => "Missing booking_id"));
                }
                break;
            default:
                echo json_encode(array("error" => "Invalid action"));
        }
    } else {
        echo json_encode(array("error" => "Missing action parameter"));
    }
}
?>
