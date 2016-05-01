package lofi.DAL;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import lofi.models.Deal;
import lofi.models.DealReservation;

public class DealRepository {

    private String connString;
    private Connection connection = null;
    private Statement statement = null;
    private PreparedStatement preparedStatement = null;
    private ResultSet resultSet = null;
    
    public DealRepository(String connectionString){
        connString = connectionString;
    }
    
    public List<Deal> GetDeals(double posX, double posY) throws Exception
    {
        String messageError = "";
        ArrayList<Deal> deals = new ArrayList<Deal>();
        
        try{
            Class.forName("com.mysql.jdbc.Driver");
        
            connection = DriverManager.getConnection(connString);

            statement = connection.createStatement();
            resultSet = statement.executeQuery(
                "SELECT " +
                "Deal.Id as id," +
                "Product.Name as productName," +
                "Dealer.Name as dealerName," +
                "Dealer.Address as dealerAddress," +
                "Deal.UnitPrize as prize," +
                "Dealer.OpeningHour as opening," +
                "Dealer.ClosingHour as closing," +
                "Deal.Quantity as quantity," +
                "(SELECT COUNT(*) FROM Reservation WHERE DealId = Deal.Id) as reserved," +
                "Dealer.DeliverySpeed as speed," +
                "Dealer.PosX as x," +
                "Dealer.PosY as y," +
                "Deal.Expiry as expiry " +
                "FROM Deal " +
                "INNER JOIN Product ON Product.Id = Deal.ProductId " +
                "INNER JOIN Dealer ON Dealer.Id = Deal.DealerId");            

            while (resultSet.next()){
                Deal deal = ReadSingleDeal(posX, posY);
                
                if (deal != null)
                    deals.add(deal);
            }
        }
        catch (Exception exc){
            messageError = exc.getMessage();
        }
        finally{
            resultSet.close();
            connection.close();
        }
        
        if (messageError.length() > 0)
            throw new Exception(messageError);
        
        return deals;
    }
    
    public void AddDealReservation(DealReservation reservation) throws Exception
    {
        String messageError = "";
    
        try{
            Class.forName("com.mysql.jdbc.Driver");
        
            connection = DriverManager.getConnection(connString);
            
            preparedStatement = connection
              .prepareStatement(
                      "insert into Reservation(DealId,Name,Address,PosX,PosY,Created) values (?, ?, ?, ?, ?, ? )");
            
            preparedStatement.setInt(1, reservation.dealId);
            preparedStatement.setString(2, reservation.name);
            preparedStatement.setString(3, reservation.address);
            preparedStatement.setDouble(4, reservation.posX);
            preparedStatement.setDouble(5, reservation.posY);
            preparedStatement.setDate(6, new java.sql.Date(new Date().getTime()));
            
            preparedStatement.executeUpdate();
        }
        catch (Exception exc){
            messageError = exc.getMessage();
        }
        finally{
            connection.close();
        }
        
        if (messageError.length() > 0)
            throw new Exception(messageError);
    }
    
    private Deal ReadSingleDeal(double posX, double posY) throws Exception
    {
        Deal deal = new Deal();
        
        deal.id = resultSet.getInt("id");
        deal.productName = resultSet.getString("productName");
        deal.dealerName = resultSet.getString("dealerName");
        deal.dealerAddress = resultSet.getString("dealerAddress");
        deal.prize = resultSet.getDouble("prize");        
        deal.openHours.start = resultSet.getInt("opening");
        deal.openHours.end = resultSet.getInt("closing");
        
        deal.stock = resultSet.getInt("quantity");
        
        int reserved = resultSet.getInt("reserved");
        
        deal.stock -= reserved;
        
        if (deal.stock <= 0)
            return null;        
        
        double deliverySpeed = resultSet.getDouble("speed");
        if (deliverySpeed == 0)
            deliverySpeed = 1e10;
        
        double x = resultSet.getDouble("x");
        double y = resultSet.getDouble("y");
        
        deal.expiry = resultSet.getDate("expiry");
        
        // calcola distanza
        double distance = Math.sqrt(((posX - x)*(posX - x) + (posY - y)*(posY - y)));
        
        deal.distance = (int) distance;
        deal.estimatedDeliver = (int) (distance / deliverySpeed);
        
        return deal;
    }
}
