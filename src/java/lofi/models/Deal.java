package lofi.models;

import java.util.Date;

public class Deal {
    
    public class OpenHours{
        public int start;
        public int end;
    }
    
    public int id;
    public String productName;
    public String dealerName;
    public String dealerAddress;
    public double prize;
    public int distance;
    public OpenHours openHours;
    public int estimatedDeliver;
    public int stock;
    public Date expiry;
    
    public Deal(){
        openHours = new OpenHours();
    }
}
